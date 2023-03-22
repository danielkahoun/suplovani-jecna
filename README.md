# Systém pro suplování na škole

Jednoduchý systém pro suplování na škole. Webová aplikace poskytuje přehled pro studenty, učitele i administrátory (tvořitelé suplování). Aplikace také umožňuje propojení s Google kalendářem.

**Použité technologie:**
- **Front-end:** Vue.js, Bootstrap
- **Back-end:** express.js, MySQL

## Funkce
- uživatelské role (student, učitel, tvořitel suplování)
- týdenní přehled pro studenty a učitele
- celoškolní přehled pro tvořitele
- dodatečné informace o suplování po rozkliknutí hodiny
- správa uživatelů (vytváření a mazání)
- propojení s Google Kalendářem 

## Pokyny pro spuštění aplikace 
### požadavky 
- MySQL server 
- Node.js 
- Docker

### spuštění aplikace ve vývojářské verzi (bez Dockeru)

```#~/client npm install``` 

```#~/client npm run dev```

```#~/server npm install```

```#~/server node .```

**spuštění backend serveru:** 
(na Windows zařízeních je nutné spouštět server skrze git bash či Linux subsystem)

```
#~/server
HOSTNAME=localhost
DB_USER=<UZIVATEL>
DB_NAME=<NAZEV_DATABAZE>
DB_PASS=<HESLO>
DB_HOST=<ADRESA_DATABAZE>
DB_PORT=<PORT_DATABAZE>
node .
```

### spuštění aplikace v produkční verzi prostřednictvím Dockeru 

```docker build -t jecna-suplovani .```

ve složce projektu vytvoříme soubor **.env** a v něm nastavíme následující parametry:

```
HOSTNAME=localhost
DB_USER=<UZIVATEL>
DB_NAME=<NAZEV_DATABAZE>
DB_PASS=<HESLO>
DB_HOST=<ADRESA_DATABAZE>
DB_PORT=<PORT_DATABAZE>
```

```docker run --env-file .env jecna-suplovani env```
