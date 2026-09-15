window.NORMTOKEN_DATA = {
  "abstract": "Semantic speech tokens should preserve linguistic content while suppressing utterance-specific acoustic and duration variation. However, existing speech-to-unit (S2U) tokenizers often retain speaker-dependent acoustic variation and duration information. Therefore, we propose NormToken, an iterative semantic token purification framework that alternates S2U and text-to-unit (T2U) training. Each T2U model predicts text-conditioned pseudo-targets for a newly initialized S2U tokenizer, whose outputs define the target space for the next iteration. This cycle drives the two models toward a shared, text-predictable token space. Experiments on Mandarin and English show improved S2U–T2U agreement and parallel-utterance token consistency. De-tokenizers trained on the initial and refined token spaces further prove that the refined token maintains competitive WER and CER while improving speaker similarity in both voice cloning and text-to-speech synthesis. In voice cloning, speech generated with the refined tokens has a speaking rate closer to that of the acoustic reference, suggesting that the tokens retain less duration information.",
  "samples": {
    "tts": {
      "zh": [
        {
          "id": "tts-zh-01",
          "originalId": "10002309-00000011",
          "text": "自动驾驶将大幅提升出行安全，效率。",
          "referenceText": "前方有左急转弯，请减速慢行。",
          "audio": {
            "reference": {
              "src": "assets/audio/tts-zh-01-reference.wav",
              "duration": 4.021,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/tts-zh-01-iter0.wav",
              "duration": 3.381,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/tts-zh-01-iter4.wav",
              "duration": 4.597,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            }
          },
          "metadata": "zh/meta.lst"
        },
        {
          "id": "tts-zh-02",
          "originalId": "10002334-00000041",
          "text": "经济发展是城市高效宜居发展的基石。",
          "referenceText": "前方有左急转弯，请减速慢行。",
          "audio": {
            "reference": {
              "src": "assets/audio/tts-zh-02-reference.wav",
              "duration": 6.075,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/tts-zh-02-iter0.wav",
              "duration": 4.139,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/tts-zh-02-iter4.wav",
              "duration": 7.285,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            }
          },
          "metadata": "zh/meta.lst"
        },
        {
          "id": "tts-zh-03",
          "originalId": "10002352-00000005",
          "text": "女性可以成为成功的科学家，工程师和程序员。",
          "referenceText": "不断提升安全业务能力。",
          "audio": {
            "reference": {
              "src": "assets/audio/tts-zh-03-reference.wav",
              "duration": 4.043,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/tts-zh-03-iter0.wav",
              "duration": 5.184,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/tts-zh-03-iter4.wav",
              "duration": 8.096,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            }
          },
          "metadata": "zh/meta.lst"
        }
      ],
      "en": [
        {
          "id": "tts-en-01",
          "originalId": "common_voice_en_120405-common_voice_en_120406",
          "text": "The only shadow was that of the few scattered pine trees.",
          "referenceText": "He approached the mass and was surprised at the size and the shape.",
          "audio": {
            "reference": {
              "src": "assets/audio/tts-en-01-reference.wav",
              "duration": 5.958,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/tts-en-01-iter0.wav",
              "duration": 3.744,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/tts-en-01-iter4.wav",
              "duration": 5.387,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            }
          },
          "metadata": "en/meta.lst"
        },
        {
          "id": "tts-en-02",
          "originalId": "common_voice_en_1205005-common_voice_en_1205007",
          "text": "The work of the tailor is seen on each side.",
          "referenceText": "Roaming endlessly around the park, she wants to go home.",
          "audio": {
            "reference": {
              "src": "assets/audio/tts-en-02-reference.wav",
              "duration": 3.701,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/tts-en-02-iter0.wav",
              "duration": 2.827,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/tts-en-02-iter4.wav",
              "duration": 3.051,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            }
          },
          "metadata": "en/meta.lst"
        },
        {
          "id": "tts-en-03",
          "originalId": "common_voice_en_123125-common_voice_en_123126",
          "text": "After all, who doesn’t want to overcome new challenges and achieve great heights?",
          "referenceText": "There's no danger, the boy said, when they had moved on past the encampment.",
          "audio": {
            "reference": {
              "src": "assets/audio/tts-en-03-reference.wav",
              "duration": 4.512,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/tts-en-03-iter0.wav",
              "duration": 5.035,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/tts-en-03-iter4.wav",
              "duration": 4.725,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            }
          },
          "metadata": "en/meta.lst"
        }
      ]
    },
    "vc": {
      "zh": [
        {
          "id": "vc-zh-01",
          "originalId": "10002287-00000094_10002290-00000102",
          "text": "说说你们在京藏高速怀安段，堵车现场看到的情况。",
          "referenceText": "在此奉劝大家别乱打美白针。",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-zh-01-reference.wav",
              "duration": 4.741,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-zh-01-iter0.wav",
              "duration": 5.696,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-zh-01-iter4.wav",
              "duration": 7.317,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-zh-01-source.wav",
              "duration": 5.168,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-zh-01-cosy3.wav",
              "duration": 5.18,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "zh/non_para_reconstruct_meta.lst"
        },
        {
          "id": "vc-zh-02",
          "originalId": "10002290-00000094_10002298-00000016",
          "text": "共同建设面向未来的交通，和出行服务新生态。",
          "referenceText": "对此，乔宝云认为有夸大的成分。",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-zh-02-reference.wav",
              "duration": 4.123,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-zh-02-iter0.wav",
              "duration": 5.056,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-zh-02-iter4.wav",
              "duration": 5.771,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-zh-02-source.wav",
              "duration": 4.603,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-zh-02-cosy3.wav",
              "duration": 4.6,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "zh/non_para_reconstruct_meta.lst"
        },
        {
          "id": "vc-zh-03",
          "originalId": "10002298-00000001_10002309-00000033",
          "text": "目前中国互联网国际化还在开拓阶段。",
          "referenceText": "顺风时提高警惕，逆风时笃定前行。",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-zh-03-reference.wav",
              "duration": 4.197,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-zh-03-iter0.wav",
              "duration": 4.619,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-zh-03-iter4.wav",
              "duration": 4.192,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-zh-03-source.wav",
              "duration": 4.607,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-zh-03-cosy3.wav",
              "duration": 4.62,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "zh/non_para_reconstruct_meta.lst"
        }
      ],
      "en": [
        {
          "id": "vc-en-01",
          "originalId": "common_voice_en_10119832_common_voice_en_103675-common_voice_en_103676",
          "text": "One by one, the campfires were extinguished, and the oasis fell as quiet as the desert.",
          "referenceText": "We asked over twenty different people, and they all said it was his.",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-en-01-reference.wav",
              "duration": 3.904,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-en-01-iter0.wav",
              "duration": 6.336,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-en-01-iter4.wav",
              "duration": 5.611,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-en-01-source.wav",
              "duration": 6.364,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-en-01-cosy3.wav",
              "duration": 6.38,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "en/non_para_reconstruct_meta.lst"
        },
        {
          "id": "vc-en-02",
          "originalId": "common_voice_en_103675_common_voice_en_10933823-common_voice_en_10933822",
          "text": "When it comes to the crunch, our company will become insolvent.",
          "referenceText": "I'm never more aware of a room's acoustics than when I'm trying to enjoy a snack I have no intention of sharing.",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-en-02-reference.wav",
              "duration": 6.485,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-en-02-iter0.wav",
              "duration": 4.085,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-en-02-iter4.wav",
              "duration": 3.52,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-en-02-source.wav",
              "duration": 4.193,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-en-02-cosy3.wav",
              "duration": 4.2,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "en/non_para_reconstruct_meta.lst"
        },
        {
          "id": "vc-en-03",
          "originalId": "common_voice_en_10933823_common_voice_en_120405-common_voice_en_120402",
          "text": "I'm never more aware of a room's acoustics than when I'm trying to enjoy a snack I have no intention of sharing.",
          "referenceText": "Sometimes I overthink things which leads me to postpone and ultimately never achieve the goal I had in mind.",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-en-03-reference.wav",
              "duration": 7.677,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-en-03-iter0.wav",
              "duration": 8.267,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-en-03-iter4.wav",
              "duration": 7.36,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-en-03-source.wav",
              "duration": 8.684,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-en-03-cosy3.wav",
              "duration": 8.7,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "en/non_para_reconstruct_meta.lst"
        }
      ]
    }
  }
};
