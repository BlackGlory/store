# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.4.0](https://github.com/BlackGlory/store/compare/v0.3.14...v0.4.0) (2023-01-30)


### ⚠ BREAKING CHANGES

* - The `Accept-Version` header is semver now.
- Removed `/metrics`.
- Removed HTTP2 support.

* upgrade dependencies ([f689824](https://github.com/BlackGlory/store/commit/f68982447f1c6b15f078757a757dd42da31221d1))

### [0.3.14](https://github.com/BlackGlory/store/compare/v0.3.13...v0.3.14) (2022-12-01)


### Bug Fixes

* edge cases ([a67caa3](https://github.com/BlackGlory/store/commit/a67caa3cbc95aa829d09fdd1d3b34ef224556e60))

### [0.3.13](https://github.com/BlackGlory/store/compare/v0.3.12...v0.3.13) (2022-08-11)

### [0.3.12](https://github.com/BlackGlory/store/compare/v0.3.11...v0.3.12) (2022-08-11)

### [0.3.11](https://github.com/BlackGlory/store/compare/v0.3.10...v0.3.11) (2022-07-27)


### Bug Fixes

* cannot find module dist/index.cjs ([f34a53c](https://github.com/BlackGlory/store/commit/f34a53ce0bad034cc345a446bf50d5b6d3cd2285))

### [0.3.10](https://github.com/BlackGlory/store/compare/v0.3.9...v0.3.10) (2022-07-27)

### [0.3.9](https://github.com/BlackGlory/store/compare/v0.3.8...v0.3.9) (2022-04-15)

### [0.3.8](https://github.com/BlackGlory/store/compare/v0.3.7...v0.3.8) (2022-02-16)

### [0.3.7](https://github.com/BlackGlory/store/compare/v0.3.6...v0.3.7) (2022-02-06)


### Bug Fixes

* **set:** validation ([771af10](https://github.com/BlackGlory/store/commit/771af1009b1c7f2ed0bd8564a55a14c5efea7f46))

### [0.3.6](https://github.com/BlackGlory/store/compare/v0.3.5...v0.3.6) (2022-01-16)


### Features

* add accept-version support ([2a46368](https://github.com/BlackGlory/store/commit/2a46368215ba0c6fcecbc463e3679a9ae228d914))
* add cache-control header ([90c48bb](https://github.com/BlackGlory/store/commit/90c48bbd926694ee50f47eac46235990a428b4f0))


### Bug Fixes

* **docker:** healthcheck ([4589634](https://github.com/BlackGlory/store/commit/4589634293f4661ec31d691b4f31d11a8c3cada5))

### [0.3.5](https://github.com/BlackGlory/store/compare/v0.3.4...v0.3.5) (2021-10-14)

### [0.3.4](https://github.com/BlackGlory/store/compare/v0.3.3...v0.3.4) (2021-07-13)

### [0.3.3](https://github.com/BlackGlory/store/compare/v0.3.2...v0.3.3) (2021-07-12)

### [0.3.2](https://github.com/BlackGlory/store/compare/v0.3.1...v0.3.2) (2021-07-03)

### [0.3.1](https://github.com/BlackGlory/store/compare/v0.3.0...v0.3.1) (2021-06-21)


### Features

* add /health ([e2aadc5](https://github.com/BlackGlory/store/commit/e2aadc54f59811f80843cc125b3ee1c844d51101))


### Bug Fixes

* docker build ([f67af07](https://github.com/BlackGlory/store/commit/f67af072d49a312496534dffe0e64e59f1d81db5))
* replace fs-extra with extra-filesystem ([30868e9](https://github.com/BlackGlory/store/commit/30868e9b04d750036632b731ccfa9073ea53aff0))
* stats ([d2ae294](https://github.com/BlackGlory/store/commit/d2ae294ce41eac282edb3008752342d5beb1fe93))

## [0.3.0](https://github.com/BlackGlory/store/compare/v0.2.1...v0.3.0) (2021-04-28)


### ⚠ BREAKING CHANGES

* The database scheme has been upgraded.

* rename ([87a0928](https://github.com/BlackGlory/store/commit/87a0928ee7d2422207f2f600f2dae2947fb657f8))

### [0.2.1](https://github.com/BlackGlory/store/compare/v0.2.0...v0.2.1) (2021-03-17)

## 0.2.0 (2021-03-14)


### ⚠ BREAKING CHANGES

* rename /api to /admin
* /stats => /metrics
* list => listItems
info => listStores + stats
* STORE_WRITE_PAYLOAD_LIMIT => STORE_SET_PAYLOAD_LIMIT
* the database needs to be rebuilt.

### Features

* add info ([e6b7102](https://github.com/BlackGlory/store/commit/e6b710257484d5b3524792f16691ce55d1787982))
* add listStores, clear, stats, remove info ([dd1b7ad](https://github.com/BlackGlory/store/commit/dd1b7addf7911fc601a7bd1678cfdd005354563c))
* add ndjson support ([228ffaa](https://github.com/BlackGlory/store/commit/228ffaaf2f1fd66a0fba45ce19a1f51951346b8c))
* add revision policy DAO ([43099cc](https://github.com/BlackGlory/store/commit/43099cc818f1a7e9fa38655fff088a843bb42c33))
* add revision-policy ([6aea9bf](https://github.com/BlackGlory/store/commit/6aea9bfb035631c38803a354d92048d48d51bb90))
* add revision-policy api ([24c73ab](https://github.com/BlackGlory/store/commit/24c73ab175c96f43d51d5bb688528136295b7193))
* add robots.txt ([e9bcf5d](https://github.com/BlackGlory/store/commit/e9bcf5d82353a5191ab33798b8e4a8808725a479))
* add store ([abd5428](https://github.com/BlackGlory/store/commit/abd542805b6719780a4d90d086fef9f11b0f8df5))
* add store services ([8cc3247](https://github.com/BlackGlory/store/commit/8cc3247ee0693c6bf8d9cceffaba2b57b8f2d5e8))
* add test cases for store service ([7899737](https://github.com/BlackGlory/store/commit/789973786a1c4a36d56d532aaa59f8ed186d6fbe))
* auto vacuum ([571dd09](https://github.com/BlackGlory/store/commit/571dd093ad52908fdbae2739962f06938470f8fe))
* auto_vacuum ([bb2f2c2](https://github.com/BlackGlory/store/commit/bb2f2c2bd710ab73cf9e4ca7f7b8ab09e050e7c6))
* custom ajv options ([ea57b23](https://github.com/BlackGlory/store/commit/ea57b23e371ff04cf931c01a0d8de3cdf539c0d2))
* disable auto_vacuum ([e8c53f9](https://github.com/BlackGlory/store/commit/e8c53f921266f6274f623cdd8b4f620f1d6aad95))
* doc is no longer required to be a dict ([427500e](https://github.com/BlackGlory/store/commit/427500efe104b461a7ce8873baa5d2dd966a905f))
* hash => revision ([bf69de8](https://github.com/BlackGlory/store/commit/bf69de8f6bdde57d529a5778a2a8fe1ba70e1c4b))
* init ([888ac41](https://github.com/BlackGlory/store/commit/888ac415c4c85fd061d5c6f90d28645fa37c1ef8))
* memoize environments ([ce7794e](https://github.com/BlackGlory/store/commit/ce7794ebd1df42491ce6e1df524cba92db610432))
* oneOf => anyOf ([37b7d41](https://github.com/BlackGlory/store/commit/37b7d410508c2c2f3a102c84a8c36299e6996abb))
* prometheus metrics ([495882a](https://github.com/BlackGlory/store/commit/495882a0b7fcc64fb542504b933b6191cca8f2eb))
* remove unused dependencies ([1475459](https://github.com/BlackGlory/store/commit/14754594375ead37fab2d2dc60a35ba876f49e1c))
* rename /api to /admin ([c2caa98](https://github.com/BlackGlory/store/commit/c2caa9821177e7b2a0a8f445cac115b1582f8123))
* rename rev to revision ([4532ffb](https://github.com/BlackGlory/store/commit/4532ffbced3f119b34f411fbc7aa61239e9adb60))
* rename stats to metrics ([78ee847](https://github.com/BlackGlory/store/commit/78ee8475769f388983730a707e1444b8bca2efde))
* replace GROUP BY with DISTINCT ([c6e4df8](https://github.com/BlackGlory/store/commit/c6e4df82e18d43020ced62e6c0520721394ca0a6))
* replace leveldb with sqlite3 ([5a3569f](https://github.com/BlackGlory/store/commit/5a3569ffbe2fe83dcec980440fce4c57c616cc90))
* store DAO ([769cd94](https://github.com/BlackGlory/store/commit/769cd94492472516a0749785703418554c6f7805))
* support pm2 ([f654084](https://github.com/BlackGlory/store/commit/f654084095cbdc788f401ff91df767c3d69f5c93))
* support STORE_DATA ([ecafd9d](https://github.com/BlackGlory/store/commit/ecafd9d7d7b1fac34f3cffc009ec72794cb18e63))


### Bug Fixes

* auto_vacuum ([28a07a0](https://github.com/BlackGlory/store/commit/28a07a08f58b3dcaca888a6265c854164cc99054))
* body ([ba40724](https://github.com/BlackGlory/store/commit/ba40724de405354b84f08358de43d2cda7715198))
* examples ([8c03be7](https://github.com/BlackGlory/store/commit/8c03be7ac9149c380e02d0523330411b64bdd5ac))
* param schemas ([88ac2a3](https://github.com/BlackGlory/store/commit/88ac2a36fcf6b1feaffefe7cf4f76ac9c5a028b1))
* process.on ([ddb8fce](https://github.com/BlackGlory/store/commit/ddb8fcec74303520753f041ccbcb863e4a70e72e))
* schema ([a57d15a](https://github.com/BlackGlory/store/commit/a57d15a06e1c5bc2b591b3ee496ae8bd4592dc4b))
* streams ([d2d6eec](https://github.com/BlackGlory/store/commit/d2d6eec3f5691b0a091ce5e256b0213d835e94fb))
* table name ([b58605b](https://github.com/BlackGlory/store/commit/b58605b4330d17c6d5569a26ecfda00a29bfc1a7))


* database ([29b21ab](https://github.com/BlackGlory/store/commit/29b21abe21b1c9ceb2b15b1ec26094d99c7fdbb4))
* rename ([56e008c](https://github.com/BlackGlory/store/commit/56e008ce8807418461e5d65f11e437e530d4f5d6))
