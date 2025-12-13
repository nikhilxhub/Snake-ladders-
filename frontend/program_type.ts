/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/snake_ladders_program.json`.
 */
export type SnakeLaddersProgram = {
  "address": "aASgAk1s5KbAMPsiLTkeuA3k1ebTammftXpsP96QB3T",
  "metadata": {
    "name": "snakeLaddersProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimPrize",
      "discriminator": [
        157,
        233,
        139,
        121,
        246,
        62,
        234,
        235
      ],
      "accounts": [
        {
          "name": "winner",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "consumeRandomness",
      "discriminator": [
        190,
        217,
        49,
        162,
        99,
        26,
        73,
        234
      ],
      "accounts": [
        {
          "name": "vrfProgramIdentity",
          "address": "9irBy75QS2BN81FUgXuHcjqceJJRuc9oDkAe8TKVvvAw"
        },
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "instructionsSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "randomness",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "createGame",
      "discriminator": [
        124,
        69,
        75,
        66,
        184,
        220,
        72,
        206
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "gameId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "maxPlayers",
          "type": "u8"
        },
        {
          "name": "entryFeeLamports",
          "type": "u64"
        },
        {
          "name": "rollFeeLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositFee",
      "discriminator": [
        11,
        51,
        105,
        140,
        198,
        229,
        7,
        77
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "joinGame",
      "discriminator": [
        107,
        112,
        18,
        38,
        56,
        173,
        60,
        128
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "passTurn",
      "discriminator": [
        224,
        215,
        57,
        43,
        234,
        162,
        75,
        182
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "requestRoll",
      "discriminator": [
        98,
        118,
        98,
        29,
        96,
        208,
        255,
        97
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "oracleQueue",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "clientSeed",
          "type": "u64"
        }
      ]
    },
    {
      "name": "startGame",
      "discriminator": [
        249,
        47,
        252,
        172,
        184,
        162,
        245,
        14
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "tooManyPlayers",
      "msg": "Too many players"
    },
    {
      "code": 6001,
      "name": "gameFinished",
      "msg": "Game is already finished"
    },
    {
      "code": 6002,
      "name": "gameFull",
      "msg": "Game is full"
    },
    {
      "code": 6003,
      "name": "alreadyJoined",
      "msg": "Player already joined"
    },
    {
      "code": 6004,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6005,
      "name": "unauthorizedEr",
      "msg": "ER signer not authorized"
    },
    {
      "code": 6006,
      "name": "invalidNonce",
      "msg": "Invalid nonce"
    },
    {
      "code": 6007,
      "name": "invalidWinner",
      "msg": "Invalid winner"
    },
    {
      "code": 6008,
      "name": "noPlayers",
      "msg": "No players in game"
    },
    {
      "code": 6009,
      "name": "invalidTurnIndex",
      "msg": "Invalid turn index"
    },
    {
      "code": 6010,
      "name": "notYourTurn",
      "msg": "Not your turn"
    },
    {
      "code": 6011,
      "name": "nonceOverflow",
      "msg": "Nonce overflow"
    },
    {
      "code": 6012,
      "name": "invalidMover",
      "msg": "Mover is not in game"
    },
    {
      "code": 6013,
      "name": "moverMismatch",
      "msg": "Mover mismatch with pending"
    },
    {
      "code": 6014,
      "name": "gameAlreadyStarted",
      "msg": "Game has already started, cannot join now"
    },
    {
      "code": 6015,
      "name": "gameNotStarted",
      "msg": "Game has not started yet"
    },
    {
      "code": 6016,
      "name": "invalidVrfProgram",
      "msg": "Invalid VRF Program ID"
    },
    {
      "code": 6017,
      "name": "gameNotFinished",
      "msg": "Game is not finished yet"
    }
  ],
  "types": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "gameId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "maxPlayers",
            "type": "u8"
          },
          {
            "name": "players",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "positions",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          },
          {
            "name": "entryFeeLamports",
            "type": "u64"
          },
          {
            "name": "rollFeeLamports",
            "type": "u64"
          },
          {
            "name": "totalPot",
            "type": "u64"
          },
          {
            "name": "currentTurnIndex",
            "type": "u8"
          },
          {
            "name": "turnNonce",
            "type": "u64"
          },
          {
            "name": "winPosition",
            "type": "u8"
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "gameState"
              }
            }
          },
          {
            "name": "finished",
            "type": "bool"
          },
          {
            "name": "winner",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "lastAnchor",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "mapFrom",
            "type": {
              "array": [
                "u8",
                20
              ]
            }
          },
          {
            "name": "mapTo",
            "type": {
              "array": [
                "u8",
                20
              ]
            }
          },
          {
            "name": "mapLen",
            "type": "u8"
          },
          {
            "name": "pendingPlayer",
            "type": {
              "option": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "gameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "created"
          },
          {
            "name": "started"
          },
          {
            "name": "finished"
          }
        ]
      }
    }
  ]
};
