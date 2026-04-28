# API StudyCycle

Resumo funcional da API HTTP do projeto.

Base local:

- http://localhost:3000

Autenticação:

- Endpoints de ciclo exigem sessão autenticada (NextAuth).
- Na prática, a autenticação é por cookie de sessão/JWT do NextAuth no navegador.

## Endpoints

### Auth

1. POST /api/auth/register

- Cria usuário com conta credentials.
- Body:

```json
{
	"name": "Lucas",
	"email": "lucas@email.com",
	"password": "12345678"
}
```

- 201:

```json
{
	"message": "Usuário criado com sucesso",
	"user": {
		"id": 1,
		"name": "Lucas",
		"email": "lucas@email.com"
	}
}
```

2. POST /api/auth/forgot-password

- Solicita link de redefinição por e-mail (Resend).
- Body:

```json
{
	"email": "lucas@email.com"
}
```

- 200:

```json
{
	"message": "Se existir uma conta com este email, enviaremos um link para redefinir sua senha."
}
```

3. POST /api/auth/reset-password

- Redefine senha usando token.
- Body:

```json
{
	"token": "<token>",
	"password": "novaSenha123"
}
```

- 200:

```json
{
	"message": "Senha redefinida com sucesso."
}
```

### Ciclos

1. POST /api/ciclos

- Cria um ciclo para o usuário logado.
- Body:

```json
{
	"name": "Ciclo ENEM",
	"weeklyHours": 20,
	"subjects": [
		{ "name": "Matemática", "affinityRank": 2, "extraWeight": 1 },
		{ "name": "Física", "affinityRank": 3, "extraWeight": 0 }
	]
}
```

- 201:

```json
{
	"id": 10
}
```

2. GET /api/ciclos/{id}

- Retorna ciclo completo com matérias.

3. PUT /api/ciclos/{id}

- Atualiza dados do ciclo e matérias.
- Regra atual: reinicia progresso do ciclo atual (zera horas atuais e marca cycle_done=false).

4. PATCH /api/ciclos/{id}

- Atualiza horas concluídas de uma matéria.
- Body:

```json
{
	"subjectId": 120,
	"hoursDone": 5
}
```

5. POST /api/ciclos/{id}/restart

- Reinicia o ciclo (zera progresso das matérias e horas atuais do ciclo).

6. DELETE /api/ciclos/{id}

- Exclui ciclo e matérias relacionadas.

## Formato de Erros

Validação Zod (400):

```json
{
	"type": "validation",
	"errors": {
		"email": "Email inválido"
	}
}
```

Demais erros:

```json
{
	"message": "Texto do erro"
}
```

Status comuns:

- 400 validação
- 401 não autenticado
- 403 acesso negado
- 404 recurso não encontrado
- 409 conflito
- 500 erro interno

## Referência completa

Para contrato detalhado (schemas, responses e exemplos), use:

- docs/swagger.yaml
