# Swagger / OpenAPI

Este projeto possui especificação OpenAPI 3.0 em:

- docs/swagger.yaml

## Opção 1: Swagger Editor (rápido)

1. Abra https://editor.swagger.io/
2. Apague o conteúdo padrão
3. Cole o conteúdo de docs/swagger.yaml

## Opção 2: Docker + Swagger UI local

No diretório do projeto, execute:

```bash
docker run --rm -p 8080:8080 -e SWAGGER_JSON=/foo/swagger.yaml -v "$PWD/docs:/foo" swaggerapi/swagger-ui
```

Depois acesse:

- http://localhost:8080

## Opção 3: Extensão VS Code

Com extensão Swagger Viewer/OpenAPI instalada, abra:

- docs/swagger.yaml

## Observações

- Endpoints de ciclo exigem autenticação (sessão NextAuth).
- Na especificação, isso aparece como `cookieAuth`.
- Para testar endpoints autenticados no Swagger UI, você pode precisar executar chamadas após autenticar no mesmo navegador/sessão.
