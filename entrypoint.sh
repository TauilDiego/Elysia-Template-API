#!/bin/sh -e

# 1️⃣ Executa migrations antes de iniciar o app
bunx prisma migrate deploy

# 2️⃣ Passa o controle para o CMD definido no Dockerfile
exec "$@"