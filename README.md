# Presentación

DuraznoStore es una aplicación móvil como presentación para la prueba de front-end para Kopcenter, en la cual se manejan aspectos como:
- Inicio de sesión
- Fetching de datos
- Registro de productos
- Búsqueda de productos (Adicional)
- Manejo de tema claro/oscuro (Adicional)
- Pantalla Splash con animación (Adicional)

# Instalación

Descargar el repositorio
```
git clone https://github.com/JesusMiguel03/prueba-tecnica-kopcenter durazno-store-app
```
```
cd durazno-store-app
```
```
npm i
```
(Opcional) Ejecutamos el comando para garantizar que el proyecto no tenga ningún error
```
npx expo-doctor
```

# BUILD
Se hace una prebuild para cargar todo en la app
## Android
```
npx expo prebuild --platform android
```

## iOS (requiere macOS)
```
npx expo prebuild --platform ios
```
Para levantar el servidor y poder acceder a la app ya sea desde un emulador (Android Studio) o desde un dispositivo físico (Expo go)
```
npx expo start
```

También podemos construir la app en local ejecutando alguno de los comandos, dependiendo del sistema operativo usado, android:
```
npx expo run:android
```
o iOS (Require Mac)
```
npx expo run:ios
```

# Credenciales

- Usuario: admin
- Contraseña: 1234
