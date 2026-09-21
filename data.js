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
          "originalId": "00004531-00000019_10002430-00000015",
          "text": "目前共享出行市场处于高速增长阶段。",
          "referenceText": "现在很多快递企业，做运输路线也都基于阿里云。",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-zh-01-reference.wav",
              "duration": 4.112,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-zh-01-iter0.wav",
              "duration": 5.771,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-zh-01-iter4.wav",
              "duration": 3.275,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-zh-01-source.wav",
              "duration": 7.949,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-zh-01-cosy3.wav",
              "duration": 7.98,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "tools/vc-selection.json#vc-zh-01"
        },
        {
          "id": "vc-zh-02",
          "originalId": "00005280-00000049_00004784-00000120",
          "text": "此外，陈威宇也负责筹措约二百万美元。",
          "referenceText": "清明节是中国的传统节日，在这天中国人要祭祀死者。",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-zh-02-reference.wav",
              "duration": 4.48,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-zh-02-iter0.wav",
              "duration": 6.357,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-zh-02-iter4.wav",
              "duration": 2.933,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-zh-02-source.wav",
              "duration": 8.779,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-zh-02-cosy3.wav",
              "duration": 8.8,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "tools/vc-selection.json#vc-zh-02"
        },
        {
          "id": "vc-zh-03",
          "originalId": "00005281-00000094_10003102-00000076",
          "text": "看来我是唯一不写博客的人。",
          "referenceText": "狗是肉食动物，狗屎味道很浓，可以说是臭气熏天。",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-zh-03-reference.wav",
              "duration": 4.224,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-zh-03-iter0.wav",
              "duration": 5.035,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-zh-03-iter4.wav",
              "duration": 2.453,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-zh-03-source.wav",
              "duration": 6.363,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-zh-03-cosy3.wav",
              "duration": 6.38,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "tools/vc-selection.json#vc-zh-03"
        }
      ],
      "en": [
        {
          "id": "vc-en-01",
          "originalId": "common_voice_en_17899910_common_voice_en_19789569-common_voice_en_19789567",
          "text": "Playing house and pretending to be someone else are examples of this phenomenon.",
          "referenceText": "Cats and Dogs each hate the other.",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-en-01-reference.wav",
              "duration": 3.302,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-en-01-iter0.wav",
              "duration": 4.789,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-en-01-iter4.wav",
              "duration": 8.085,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-en-01-source.wav",
              "duration": 3.865,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-en-01-cosy3.wav",
              "duration": 3.9,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "tools/vc-selection.json#vc-en-01"
        },
        {
          "id": "vc-en-02",
          "originalId": "common_voice_en_20905661_common_voice_en_2331-common_voice_en_2332",
          "text": "It isn't the money.",
          "referenceText": "He was interested in music and cooking and food, he was very companionable.",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-en-02-reference.wav",
              "duration": 4.053,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-en-02-iter0.wav",
              "duration": 1.899,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-en-02-iter4.wav",
              "duration": 1.12,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-en-02-source.wav",
              "duration": 2.504,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-en-02-cosy3.wav",
              "duration": 2.56,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "tools/vc-selection.json#vc-en-02"
        },
        {
          "id": "vc-en-03",
          "originalId": "common_voice_en_120405_common_voice_en_21184954-common_voice_en_21184959",
          "text": "Legislation provides for transfer of interest, dividends, and capital.",
          "referenceText": "He approached the mass and was surprised at the size and the shape.",
          "audio": {
            "reference": {
              "src": "assets/audio/vc-en-03-reference.wav",
              "duration": 5.958,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter0": {
              "src": "assets/audio/vc-en-03-iter0.wav",
              "duration": 4.267,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "iter4": {
              "src": "assets/audio/vc-en-03-iter4.wav",
              "duration": 7.104,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "source": {
              "src": "assets/audio/vc-en-03-source.wav",
              "duration": 3.926,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 16,
              "codec": 1
            },
            "cosy3": {
              "src": "assets/audio/vc-en-03-cosy3.wav",
              "duration": 3.94,
              "sampleRate": 24000,
              "channels": 1,
              "bits": 32,
              "codec": 3
            }
          },
          "metadata": "tools/vc-selection.json#vc-en-03"
        }
      ]
    }
  }
};
