import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Música - Taller API REST',
            version: '1.0.0',
            description: 'API REST para gestión de autores y canciones con autenticación JWT',
            contact: {
                name: 'Harold Guerrero',
                email: 'harold.guerrero02@uptc.edu.co'
            }
        },
        servers: [
            {
                url: 'http://localhost:6972',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Usuario: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Nombre del usuario'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email del usuario'
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            description: 'Contraseña del usuario'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            default: 'user',
                            description: 'Rol del usuario'
                        }
                    }
                },
                Autor: {
                    type: 'object',
                    required: ['id', 'name'],
                    properties: {
                        id: {
                            type: 'number',
                            description: 'ID único del autor',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del autor',
                            minLength: 2,
                            maxLength: 100,
                            example: 'Bad Bunny'
                        },
                        apodo: {
                            type: 'string',
                            description: 'Apodo del autor',
                            maxLength: 50,
                            example: 'El Conejo Malo'
                        },
                        biografia: {
                            type: 'string',
                            description: 'Biografía del autor',
                            maxLength: 1000,
                            example: 'Cantante y compositor puertorriqueño de reggaetón y trap'
                        },
                        fechaNacimiento: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de nacimiento del autor',
                            example: '1994-03-10'
                        },
                        nacionalidad: {
                            type: 'string',
                            description: 'Nacionalidad del autor',
                            maxLength: 50,
                            example: 'Puertorriqueño'
                        },
                        totalCanciones: {
                            type: 'number',
                            description: 'Número total de canciones (virtual)',
                            example: 15
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Estado del autor',
                            default: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de última actualización'
                        }
                    }
                },
                Cancion: {
                    type: 'object',
                    required: ['name', 'autor'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Nombre de la canción',
                            minLength: 2,
                            maxLength: 200,
                            example: 'Tití Me Preguntó'
                        },
                        album: {
                            type: 'string',
                            description: 'Álbum de la canción',
                            maxLength: 100,
                            example: 'Un Verano Sin Ti'
                        },
                        duracion: {
                            type: 'number',
                            description: 'Duración en segundos',
                            minimum: 1,
                            maximum: 3600,
                            example: 240
                        },
                        duracionFormateada: {
                            type: 'string',
                            description: 'Duración formateada (virtual)',
                            example: '4:00'
                        },
                        genero: {
                            type: 'string',
                            description: 'Género musical',
                            maxLength: 50,
                            example: 'Reggaetón'
                        },
                        año: {
                            type: 'number',
                            description: 'Año de lanzamiento',
                            minimum: 1900,
                            example: 2022
                        },
                        autor: {
                            type: 'string',
                            description: 'ID del autor (ObjectId)',
                            example: '673a1b2c3d4e5f6789012345'
                        },
                        letra: {
                            type: 'string',
                            description: 'Letra de la canción',
                            maxLength: 5000
                        },
                        urlAudio: {
                            type: 'string',
                            description: 'URL del archivo de audio',
                            example: 'https://example.com/audio.mp3'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Estado de la canción',
                            default: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de última actualización'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        state: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'string',
                            description: 'Mensaje de error'
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        state: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            description: 'Mensaje de éxito'
                        },
                        data: {
                            type: 'object',
                            description: 'Datos de respuesta'
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'integer',
                            description: 'Página actual'
                        },
                        limit: {
                            type: 'integer',
                            description: 'Elementos por página'
                        },
                        total: {
                            type: 'integer',
                            description: 'Total de elementos'
                        },
                        pages: {
                            type: 'integer',
                            description: 'Total de páginas'
                        }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Token de acceso requerido o inválido',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                state: false,
                                error: 'Token de acceso requerido'
                            }
                        }
                    }
                },
                BadRequestError: {
                    description: 'Datos de entrada inválidos',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                state: false,
                                error: 'Datos de entrada inválidos'
                            }
                        }
                    }
                },
                NotFoundError: {
                    description: 'Recurso no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                state: false,
                                error: 'Recurso no encontrado'
                            }
                        }
                    }
                },
                InternalServerError: {
                    description: 'Error interno del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                state: false,
                                error: 'Error interno del servidor'
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./routes/*.mjs', './controllers/*.mjs']
};

export const specs = swaggerJsdoc(options);
