import torch

from facenet_pytorch import MTCNN

detector = MTCNN(keep_all=True).eval()

torch.onnx.export(
    detector,
    torch.randn(1, 3, 160, 160) + 0.5,
    "mtcnn-onnx.onnx",
    export_params=True,
    opset_version=11,
    do_constant_folding=True,
    input_names=["input"],
    output_names=["output_boxes", "output_probs"],  # Model output names
    dynamic_axes={
        "input": {0: "batch_size"},
        "output_boxes": {0: "batch_size"},
        "output_probs": {0: "batch_size"},
    },
)
