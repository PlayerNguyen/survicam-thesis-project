from facenet_pytorch import InceptionResnetV1
from PIL.Image import Image
import torch
from torchvision.transforms.functional import to_tensor


def get_device():
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")


print(f" [Device] Currently using {get_device()}")

resnet = InceptionResnetV1(pretrained="vggface2", device=get_device()).eval()


def embedding_image(pil: Image) -> torch.Tensor:
    # transform to tensor
    # tensor = pil_to_tensor(pil).to(device=get_device())
    tensor = to_tensor(pil).to(device=get_device())
    return resnet(tensor.unsqueeze(0))
