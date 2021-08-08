# Bienvenido al Proyecto "Coupons & Stores"

Este proyecto se realizó como actividad integradora del Onboarding 2021 de Rooftop para la orientación Backend. Se trata de un microservicio que se encarga de gestionar la  
información de promociones, cupones y tiendas. Para esto se utilizó una base de datos en MySQL y una API Rest hecha con Express, TypeORM y Typescript.

## Scripts Disponibles:

En el directorio del proyecto se puede ejecutar:

`npm run dev`
Para ejecutar la aplicación en desarrollo.

`npm run build`
Para compilar de Typescript a Javascript

## Recursos

La aplicación permite consultar los siguientes recursos

### Cupones

Se puede abrir desde [http://localhost:3000/coupons](http://localhost:3000/coupons)

Aceptas las siguientes peticiones

#### GET

Permite consultar si un cupon corresponde a un determinado email.
Se debe ingresar el parametro "email" y "codigo del cupon".
Ej: [http://localhost:3000/coupons?email=abmem@vuec.ps&code=H37VUSZS](http://localhost:3000/coupons?email=abmem@vuec.ps&code=H37VUSZS)

#### POST

Se crea un cupón nuevo. Se debe ingresar un código con un total exacto de 8 caracteres entre letras y numeros.
Ej: [http://localhost:3000/coupons?code=YYAA58RP](http://localhost:3000/coupons?code=YYAA58RP)

#### PATCH

Se asigna un email de usuario a un cupon existente. El email no debe haber generado un cupón previamente.
Se debe ingresar un email válido.
Ej: [http://localhost:3000/coupons?email=gew@av.pm](http://localhost:3000/coupons?email=gew@av.pm)

#### DELETE

Se da de baja un cupón que no haya sido asignado a un cliente.
Se debe ingresar el id del cupón.
Ej: [http://localhost:3000/coupons?id=100](http://localhost:3000/coupons?id=100)

### Coupons Stats

#### GET

Devuelve un objeto que resume:

- Cantidad total de cupones existente
- Cantidad total de cupones asignados
- Cantidad total de cupones sin asignar
- Cantidad total de cupones creados por dia
- Cantidad total de cupones asignados por dia

Ej: [http://localhost:3000/coupons/stats](http://localhost:3000/coupons/stats)

### Stores

#### GET

Devuelve un listado de todas las tiendas y su cantidad si no se ingresan parametros.
Ej: [http://localhost:3000/stores](http://localhost:3000/stores)
También devuelve un paginado de 10 tiendas y la cantidad total de tiendas si se indica.
Ej: [http://localhost:3000/stores?page=1](http://localhost:3000/stores?page=1)
Por último permite buscar una tienda por su nombre.
Ej: [http://localhost:3000/stores?name=AMERCO](http://localhost:3000/stores?name=AMERCO)

#### POST

Permite dar de alta nuevas tiendas. Se debe ingresar un nombre y domicilio.
Ej: [http://localhost:3000/stores?name=Joaco&address=123 Corrientes](http://localhost:3000/stores?name=Joaco&address=123 Corrientes)

#### DELETE

Se da de baja una tienda pasandole el id.
Ej: [http://localhost:3000/stores?id=501](http://localhost:3000/stores?id=501)

_En el repositorio se puede encontrar un archivo con las peticiones para utilizar con Postman_

## Material de consulta:

Para el desarrollo de la aplicación se consultaron los siguientes enlaces:

- Modelo para [estructurar aplicación en Express y TypeORM](https://github.com/FaztWeb/typeorm-crud-restapi/tree/master/src)
- Cómo saber si [una condición es null en Typeorm](https://stackoverflow.com/questions/46879840/how-can-i-have-is-null-condition-in-typeorm-find-options)
- Documentación de Typeorm sobre [búsquedas](https://github.com/typeorm/typeorm/blob/master/docs/find-options.md)
- Explicación sobre [paginado en API](https://ignaciochiazzo.medium.com/paginating-requests-in-apis-d4883d4c1c4c)
- Explicacion sobre [paginado en Typeorm](https://blog.8bitzen.com/posts/28-06-2019-typeorm-pagination)
- Documentación sobre [query builder en Typeorm](https://typeorm.io/#/select-query-builder)
- Cómo usar select y [distinct para fechas en MySQL](https://stackoverflow.com/questions/15915606/select-distinct-timestamp-as-dd-mm-yyyy-mysql)
- Cómo utilizar [select en Typeorm](https://stackoverflow.com/questions/62894090/typeorm-select-with-case-insensitive-distinct)
