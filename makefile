run-app:
	go build cmd/main/main.go && ./main.exe

migrate-db:
	go run cmd/migrate/migrate.go

reset-db:
	go run cmd/reset-db/reset-db.go
