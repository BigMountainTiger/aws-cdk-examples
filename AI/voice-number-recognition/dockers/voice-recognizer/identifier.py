import torch
import torchaudio
from glob import glob

path = '/opt/snakers4_silero-models_master'
device = torch.device('cpu')
(model, decoder, utils) = torch.hub.load(repo_or_dir = path,
  model = 'silero_stt',
  source = 'local',
  skip_validation = True,
  device = device
)

(read_batch, split_into_batches, read_audio, prepare_model_input) = utils

def identify(file):

  files = glob(file)
  batches = split_into_batches(files, batch_size = 1)
  input = prepare_model_input(read_batch(batches[0]), device = device)
  output = model(input)

  results = []
  for r in output:
    results.append(decoder(r.cpu()).strip())

  return ''.join(results)

