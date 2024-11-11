from facenet_pytorch import MTCNN
import torch
import torch.nn as nn
import torch.quantization


class QuantizedMTCNN(MTCNN):
    def __init__(self, *args, **kwargs):
        super(QuantizedMTCNN, self).__init__(*args, **kwargs)
        self.quantize_model()

    def quantize_model(self):
        # Set the model in evaluation mode
        self.eval()

        # Convert each network to quantized versions
        self.pnet = self._quantize_network(self.pnet, (1, 3, 12, 12))
        self.rnet = self._quantize_network(self.rnet, (1, 3, 24, 24))
        self.onet = self._quantize_network(self.onet, (1, 3, 48, 48))

    def _quantize_network(self, network, input_shape):
        # Fuse layers for quantization (if applicable)
        # This step is generally model-specific, MTCNN may or may not need it
        # You can skip this if your network doesn't require fusing

        # Prepare the model for quantization
        network.qconfig = torch.quantization.get_default_qconfig("fbgemm")

        # Prepare for static quantization
        network_fused = torch.quantization.prepare(network, inplace=False)

        # Use a dummy input to run the model and collect quantization statistics
        dummy_input = torch.randn(input_shape)  # Specify shape for each network
        network_fused(dummy_input)

        # Convert to quantized model
        network_quantized = torch.quantization.convert(network_fused, inplace=False)

        return network_quantized

    def forward(self, x):
        # Forward pass through quantized networks
        with torch.no_grad():
            x_pnet = self.pnet(x)
            x_rnet = self.rnet(x_pnet)
            x_onet = self.onet(x_rnet)
        return x_onet
