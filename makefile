main: compile \


compile: cmd/main/main.go
	go build cmd/main/main.go

migrate-db:
	go run cmd/migrate/migrate.go

reset-db:
	go run cmd/reset-db/reset-db.go
