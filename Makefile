devup:
	cd esstraba-dev && docker compose build && docker compose up -d --force-recreate && docker compose logs -f

devlogs:
	cd esstraba-dev && docker compose logs -f

devdown:
	cd esstraba-dev && docker compose down

prod:
	docker compose build && docker compose up -d --force-recreate && docker compose logs -f

prodlogs:
	docker compose logs -f
