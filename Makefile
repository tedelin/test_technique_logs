NAME=logs_app
COMPOSE_FILE=docker-compose.yml

all: start

start:
	docker compose -p $(NAME) -f $(COMPOSE_FILE) up --build -d

down:
	docker compose -p $(NAME) -f $(COMPOSE_FILE) down

stop:
	docker compose -p $(NAME) -f $(COMPOSE_FILE) stop

clean:
	docker compose -p $(NAME) -f $(COMPOSE_FILE) down --volumes --remove-orphans

dclean:
	docker system prune -af
	
re: clean all