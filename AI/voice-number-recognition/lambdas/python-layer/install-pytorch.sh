#!/bin/bash

# Pytorch cannot be installed without the URL
# https://pytorch.org/get-started/locally/
python3.9 -m pip install torch==1.9.1+cpu torchvision==0.10.1+cpu torchaudio==0.9.1 \
  -f https://download.pytorch.org/whl/torch_stable.html \
  -t python/