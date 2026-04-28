# StudyCycle

Plataforma de ciclos de estudo com distribuicao proporcional de horas por materia.

## Stack

- Next.js 16 (App Router)
- Material UI
- Sequelize (configurado em `src/lib/sequelize.js`)

## Paginas

- `/` Home page
- `/login` tela de autenticacao
- `/register` tela de registro
- `/dashboard` visao de progresso
- `/ciclo/criar` criacao de ciclo com calculo de horas

## Regra do ciclo

1. Afinidade de 1 a 5 gera peso inverso de 5x a 1x.
2. Peso extra pode ser somado manualmente por materia.
3. A formula usada e `ceil((horasSemanais / somaPesos) * pesoFinal)`.
4. Cada materia recebe no minimo 2 horas.

## Executar localmente

```bash
npm run dev
```

Abra http://localhost:3000 no navegador.

## Qualidade

```bash
npm run lint
```
