# Dumps from DB Navigator API app.vendo.noncd.db.de

In this directory, some intercepted traffic from DB Navigator. (Repo license does not apply to this directory.)

You can browse some responses of the bahn.de API and others in the [fixtures](https://github.com/public-transport/db-vendo-client/tree/main/test/fixtures) and [e2e fixtures](https://github.com/public-transport/db-vendo-client/tree/main/test/e2e/fixtures).

How to intercept DB Navigator traffic:

1. Download/extract Split APK
2. Merge APK (e.g. using [APKEditor](https://github.com/REAndroid/APKEditor))
3. decompile using apktool
4. edit [res/xml/network_security_config.xml](https://developer.android.com/privacy-and-security/security-config) to allow user CAs not just in debug 
5. recompile using apktool, sign
6. install on an Android
7. intercept with a mitm decryption tool of your choice by installing CA cert into Android store (e.g. [PCAPdroid](https://github.com/emanuele-f/PCAPdroid) with [mitm addon](https://github.com/emanuele-f/PCAPdroid-mitm), no root needed)
