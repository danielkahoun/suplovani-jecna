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

### vložení databáze

Do MySQL serveru je nutné naimportovat databázi ze souboru ```export.sql``` ([zde ke stažení](https://spsejecnacz-my.sharepoint.com/:u:/g/personal/kahoun_spsejecna_cz/EcKaPJE4mOBGkqBGilXXz6QBdpghz0ncgoQWgJt0ohX9sw?e=y42zl3))

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

ve složce projektu vytvoříme soubor ```.env``` a v něm nastavíme následující parametry:

```
HOSTNAME=0.0.0.0
DB_USER=<UZIVATEL>
DB_NAME=<NAZEV_DATABAZE>
DB_PASS=<HESLO>
DB_HOST=<ADRESA_DATABAZE>
DB_PORT=<PORT_DATABAZE>
```

```docker run -p 3000:3000 --env-file .env jecna-suplovani```
