Source: https://developers.cloudflare.com/r2/reference/wrangler-commands/index.md
Title: Wrangler commands

---
title: Wrangler commands
description: Wrangler CLI commands for managing R2 buckets and objects.
image: https://developers.cloudflare.com/dev-products-preview.png
---

> Documentation Index  
> Fetch the complete documentation index at: https://developers.cloudflare.com/r2/llms.txt  
> Use this file to discover all available pages before exploring further.

[Skip to content](#%5Ftop) 

# Wrangler commands

## `r2 bucket`

Interact with buckets in an R2 store.

Note

The `r2 bucket` commands allow you to manage application data in the Cloudflare network to be accessed from Workers using [the R2 API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/).

### `r2 bucket create`

Create a new R2 bucket

* [  npm ](#tab-panel-9255)
* [  pnpm ](#tab-panel-9256)
* [  yarn ](#tab-panel-9257)

Terminal window

```

npx wrangler r2 bucket create [NAME]


```

Terminal window

```

pnpm wrangler r2 bucket create [NAME]


```

Terminal window

```

yarn wrangler r2 bucket create [NAME]


```

* `[NAME]` ` string ` required  
The name of the new bucket
* `--location` ` string `  
The optional location hint that determines geographic placement of the R2 bucket
* `--storage-class` ` string ` alias: --s  
The default storage class for objects uploaded to this bucket
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the new bucket will be created
* `--use-remote` ` boolean `  
Use a remote binding when adding the newly created resource to your config
* `--update-config` ` boolean `  
Automatically update your config file with the newly added resource
* `--binding` ` string `  
The binding name of this resource in your Worker

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket info`

Get information about an R2 bucket

* [  npm ](#tab-panel-9258)
* [  pnpm ](#tab-panel-9259)
* [  yarn ](#tab-panel-9260)

Terminal window

```

npx wrangler r2 bucket info [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket info [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket info [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the bucket to retrieve info for
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--json` ` boolean ` default: false  
Return the bucket information as JSON

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket delete`

Delete an R2 bucket

* [  npm ](#tab-panel-9261)
* [  pnpm ](#tab-panel-9262)
* [  yarn ](#tab-panel-9263)

Terminal window

```

npx wrangler r2 bucket delete [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket delete [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket delete [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the bucket to delete
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket list`

List R2 buckets

* [  npm ](#tab-panel-9264)
* [  pnpm ](#tab-panel-9265)
* [  yarn ](#tab-panel-9266)

Terminal window

```

npx wrangler r2 bucket list


```

Terminal window

```

pnpm wrangler r2 bucket list


```

Terminal window

```

yarn wrangler r2 bucket list


```

* `--jurisdiction` ` string ` alias: --J  
The jurisdiction to list

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket catalog enable`

Enable the data catalog on an R2 bucket

* [  npm ](#tab-panel-9267)
* [  pnpm ](#tab-panel-9268)
* [  yarn ](#tab-panel-9269)

Terminal window

```

npx wrangler r2 bucket catalog enable [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket catalog enable [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket catalog enable [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the bucket to enable

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket catalog disable`

Disable the data catalog for an R2 bucket

* [  npm ](#tab-panel-9270)
* [  pnpm ](#tab-panel-9271)
* [  yarn ](#tab-panel-9272)

Terminal window

```

npx wrangler r2 bucket catalog disable [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket catalog disable [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket catalog disable [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the bucket to disable the data catalog for

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket catalog get`

Get the status of the data catalog for an R2 bucket

* [  npm ](#tab-panel-9273)
* [  pnpm ](#tab-panel-9274)
* [  yarn ](#tab-panel-9275)

Terminal window

```

npx wrangler r2 bucket catalog get [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket catalog get [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket catalog get [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket whose data catalog status to retrieve

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket catalog compaction enable`

Enable automatic file compaction for your R2 data catalog or a specific table

* [  npm ](#tab-panel-9276)
* [  pnpm ](#tab-panel-9277)
* [  yarn ](#tab-panel-9278)

Terminal window

```

npx wrangler r2 bucket catalog compaction enable [BUCKET] [NAMESPACE] [TABLE]


```

Terminal window

```

pnpm wrangler r2 bucket catalog compaction enable [BUCKET] [NAMESPACE] [TABLE]


```

Terminal window

```

yarn wrangler r2 bucket catalog compaction enable [BUCKET] [NAMESPACE] [TABLE]


```

* `[BUCKET]` ` string ` required  
The name of the bucket which contains the catalog
* `[NAMESPACE]` ` string `  
The namespace containing the table (optional, for table-level compaction)
* `[TABLE]` ` string `  
The name of the table (optional, for table-level compaction)
* `--target-size` ` number ` default: 128  
The target size for compacted files in MB (allowed values: 64, 128, 256, 512)
* `--token` ` string `  
A cloudflare api token with access to R2 and R2 Data Catalog (required for catalog-level compaction settings only)

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

Examples:

Terminal window

```

# Enable catalog-level compaction (requires token)

npx wrangler r2 bucket catalog compaction enable my-bucket --token <TOKEN>


# Enable table-level compaction

npx wrangler r2 bucket catalog compaction enable my-bucket my-namespace my-table --target-size 256


```

### `r2 bucket catalog compaction disable`

Disable automatic file compaction for your R2 data catalog or a specific table

* [  npm ](#tab-panel-9279)
* [  pnpm ](#tab-panel-9280)
* [  yarn ](#tab-panel-9281)

Terminal window

```

npx wrangler r2 bucket catalog compaction disable [BUCKET] [NAMESPACE] [TABLE]


```

Terminal window

```

pnpm wrangler r2 bucket catalog compaction disable [BUCKET] [NAMESPACE] [TABLE]


```

Terminal window

```

yarn wrangler r2 bucket catalog compaction disable [BUCKET] [NAMESPACE] [TABLE]


```

* `[BUCKET]` ` string ` required  
The name of the bucket which contains the catalog
* `[NAMESPACE]` ` string `  
The namespace containing the table (optional, for table-level compaction)
* `[TABLE]` ` string `  
The name of the table (optional, for table-level compaction)

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

Examples:

Terminal window

```

# Disable catalog-level compaction

npx wrangler r2 bucket catalog compaction disable my-bucket


# Disable table-level compaction

npx wrangler r2 bucket catalog compaction disable my-bucket my-namespace my-table


```

### `r2 bucket catalog snapshot-expiration enable`

Enable automatic snapshot expiration for your R2 data catalog or a specific table

* [  npm ](#tab-panel-9282)
* [  pnpm ](#tab-panel-9283)
* [  yarn ](#tab-panel-9284)

Terminal window

```

npx wrangler r2 bucket catalog snapshot-expiration enable [BUCKET] [NAMESPACE] [TABLE]


```

Terminal window

```

pnpm wrangler r2 bucket catalog snapshot-expiration enable [BUCKET] [NAMESPACE] [TABLE]


```

Terminal window

```

yarn wrangler r2 bucket catalog snapshot-expiration enable [BUCKET] [NAMESPACE] [TABLE]


```

* `[BUCKET]` ` string ` required  
The name of the bucket which contains the catalog
* `[NAMESPACE]` ` string `  
The namespace containing the table (optional, for table-level snapshot expiration)
* `[TABLE]` ` string `  
The name of the table (optional, for table-level snapshot expiration)
* `--older-than-days` ` number `  
Delete snapshots older than this many days, defaults to 30
* `--retain-last` ` number `  
The minimum number of snapshots to retain, defaults to 5
* `--token` ` string `  
A cloudflare api token with access to R2 and R2 Data Catalog (required for catalog-level snapshot expiration settings only)

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket catalog snapshot-expiration disable`

Disable automatic snapshot expiration for your R2 data catalog or a specific table

* [  npm ](#tab-panel-9285)
* [  pnpm ](#tab-panel-9286)
* [  yarn ](#tab-panel-9287)

Terminal window

```

npx wrangler r2 bucket catalog snapshot-expiration disable [BUCKET] [NAMESPACE] [TABLE]


```

Terminal window

```

pnpm wrangler r2 bucket catalog snapshot-expiration disable [BUCKET] [NAMESPACE] [TABLE]


```

Terminal window

```

yarn wrangler r2 bucket catalog snapshot-expiration disable [BUCKET] [NAMESPACE] [TABLE]


```

* `[BUCKET]` ` string ` required  
The name of the bucket which contains the catalog
* `[NAMESPACE]` ` string `  
The namespace containing the table (optional, for table-level snapshot expiration)
* `[TABLE]` ` string `  
The name of the table (optional, for table-level snapshot expiration)
* `--force` ` boolean ` default: false  
Skip confirmation prompt

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket cors set`

Set the CORS configuration for an R2 bucket from a JSON file

* [  npm ](#tab-panel-9288)
* [  pnpm ](#tab-panel-9289)
* [  yarn ](#tab-panel-9290)

Terminal window

```

npx wrangler r2 bucket cors set [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket cors set [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket cors set [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to set the CORS configuration for
* `--file` ` string ` required  
Path to the JSON file containing the CORS configuration
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket cors delete`

Clear the CORS configuration for an R2 bucket

* [  npm ](#tab-panel-9291)
* [  pnpm ](#tab-panel-9292)
* [  yarn ](#tab-panel-9293)

Terminal window

```

npx wrangler r2 bucket cors delete [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket cors delete [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket cors delete [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to delete the CORS configuration for
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket cors list`

List the CORS rules for an R2 bucket

* [  npm ](#tab-panel-9294)
* [  pnpm ](#tab-panel-9295)
* [  yarn ](#tab-panel-9296)

Terminal window

```

npx wrangler r2 bucket cors list [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket cors list [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket cors list [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to list the CORS rules for
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket dev-url enable`

Enable public access via the r2.dev URL for an R2 bucket

* [  npm ](#tab-panel-9297)
* [  pnpm ](#tab-panel-9298)
* [  yarn ](#tab-panel-9299)

Terminal window

```

npx wrangler r2 bucket dev-url enable [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket dev-url enable [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket dev-url enable [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to enable public access via its r2.dev URL
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket dev-url disable`

Disable public access via the r2.dev URL for an R2 bucket

* [  npm ](#tab-panel-9300)
* [  pnpm ](#tab-panel-9301)
* [  yarn ](#tab-panel-9302)

Terminal window

```

npx wrangler r2 bucket dev-url disable [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket dev-url disable [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket dev-url disable [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to disable public access via its r2.dev URL
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket dev-url get`

Get the r2.dev URL and status for an R2 bucket

* [  npm ](#tab-panel-9303)
* [  pnpm ](#tab-panel-9304)
* [  yarn ](#tab-panel-9305)

Terminal window

```

npx wrangler r2 bucket dev-url get [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket dev-url get [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket dev-url get [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket whose r2.dev URL status to retrieve
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket domain add`

Connect a custom domain to an R2 bucket

* [  npm ](#tab-panel-9306)
* [  pnpm ](#tab-panel-9307)
* [  yarn ](#tab-panel-9308)

Terminal window

```

npx wrangler r2 bucket domain add [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket domain add [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket domain add [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to connect a custom domain to
* `--domain` ` string ` required  
The custom domain to connect to the R2 bucket
* `--zone-id` ` string ` required  
The zone ID associated with the custom domain
* `--min-tls` ` string `  
Set the minimum TLS version for the custom domain (defaults to 1.0 if not set)
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket domain remove`

Remove a custom domain from an R2 bucket

* [  npm ](#tab-panel-9309)
* [  pnpm ](#tab-panel-9310)
* [  yarn ](#tab-panel-9311)

Terminal window

```

npx wrangler r2 bucket domain remove [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket domain remove [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket domain remove [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to remove the custom domain from
* `--domain` ` string ` required  
The custom domain to remove from the R2 bucket
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket domain update`

Update settings for a custom domain connected to an R2 bucket

* [  npm ](#tab-panel-9312)
* [  pnpm ](#tab-panel-9313)
* [  yarn ](#tab-panel-9314)

Terminal window

```

npx wrangler r2 bucket domain update [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket domain update [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket domain update [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket associated with the custom domain to update
* `--domain` ` string ` required  
The custom domain whose settings will be updated
* `--min-tls` ` string `  
Update the minimum TLS version for the custom domain
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket domain get`

Get custom domain connected to an R2 bucket

* [  npm ](#tab-panel-9315)
* [  pnpm ](#tab-panel-9316)
* [  yarn ](#tab-panel-9317)

Terminal window

```

npx wrangler r2 bucket domain get [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket domain get [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket domain get [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket whose custom domain to retrieve
* `--domain` ` string ` required  
The custom domain to get information for
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket domain list`

List custom domains for an R2 bucket

* [  npm ](#tab-panel-9318)
* [  pnpm ](#tab-panel-9319)
* [  yarn ](#tab-panel-9320)

Terminal window

```

npx wrangler r2 bucket domain list [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket domain list [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket domain list [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket whose connected custom domains will be listed
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket lifecycle add`

Add a lifecycle rule to an R2 bucket

* [  npm ](#tab-panel-9321)
* [  pnpm ](#tab-panel-9322)
* [  yarn ](#tab-panel-9323)

Terminal window

```

npx wrangler r2 bucket lifecycle add [BUCKET] [NAME] [PREFIX]


```

Terminal window

```

pnpm wrangler r2 bucket lifecycle add [BUCKET] [NAME] [PREFIX]


```

Terminal window

```

yarn wrangler r2 bucket lifecycle add [BUCKET] [NAME] [PREFIX]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to add a lifecycle rule to
* `[NAME]` ` string ` alias: --id  
A unique name for the lifecycle rule, used to identify and manage it.
* `[PREFIX]` ` string `  
Prefix condition for the lifecycle rule (leave empty for all prefixes)
* `--expire-days` ` number `  
Number of days after which objects expire
* `--expire-date` ` string `  
Date after which objects expire (YYYY-MM-DD)
* `--ia-transition-days` ` number `  
Number of days after which objects transition to Infrequent Access storage
* `--ia-transition-date` ` string `  
Date after which objects transition to Infrequent Access storage (YYYY-MM-DD)
* `--abort-multipart-days` ` number `  
Number of days after which incomplete multipart uploads are aborted
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation and data catalog validation prompt

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket lifecycle remove`

Remove a lifecycle rule from an R2 bucket

* [  npm ](#tab-panel-9324)
* [  pnpm ](#tab-panel-9325)
* [  yarn ](#tab-panel-9326)

Terminal window

```

npx wrangler r2 bucket lifecycle remove [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket lifecycle remove [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket lifecycle remove [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to remove a lifecycle rule from
* `--name` ` string ` alias: --id required  
The unique name of the lifecycle rule to remove
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket lifecycle list`

List lifecycle rules for an R2 bucket

* [  npm ](#tab-panel-9327)
* [  pnpm ](#tab-panel-9328)
* [  yarn ](#tab-panel-9329)

Terminal window

```

npx wrangler r2 bucket lifecycle list [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket lifecycle list [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket lifecycle list [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to list lifecycle rules for
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket lifecycle set`

Set the lifecycle configuration for an R2 bucket from a JSON file

* [  npm ](#tab-panel-9330)
* [  pnpm ](#tab-panel-9331)
* [  yarn ](#tab-panel-9332)

Terminal window

```

npx wrangler r2 bucket lifecycle set [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket lifecycle set [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket lifecycle set [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to set lifecycle configuration for
* `--file` ` string ` required  
Path to the JSON file containing lifecycle configuration
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation and data catalog validation prompt

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket lock add`

Add a lock rule to an R2 bucket

* [  npm ](#tab-panel-9333)
* [  pnpm ](#tab-panel-9334)
* [  yarn ](#tab-panel-9335)

Terminal window

```

npx wrangler r2 bucket lock add [BUCKET] [NAME] [PREFIX]


```

Terminal window

```

pnpm wrangler r2 bucket lock add [BUCKET] [NAME] [PREFIX]


```

Terminal window

```

yarn wrangler r2 bucket lock add [BUCKET] [NAME] [PREFIX]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to add a bucket lock rule to
* `[NAME]` ` string ` alias: --id  
A unique name for the bucket lock rule, used to identify and manage it.
* `[PREFIX]` ` string `  
Prefix condition for the bucket lock rule (set to "" for all prefixes)
* `--retention-days` ` number `  
Number of days which objects will be retained for
* `--retention-date` ` string `  
Date after which objects will be retained until (YYYY-MM-DD)
* `--retention-indefinite` ` boolean `  
Retain objects indefinitely
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket lock remove`

Remove a bucket lock rule from an R2 bucket

* [  npm ](#tab-panel-9336)
* [  pnpm ](#tab-panel-9337)
* [  yarn ](#tab-panel-9338)

Terminal window

```

npx wrangler r2 bucket lock remove [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket lock remove [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket lock remove [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to remove a bucket lock rule from
* `--name` ` string ` alias: --id required  
The unique name of the bucket lock rule to remove
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket lock list`

List lock rules for an R2 bucket

* [  npm ](#tab-panel-9339)
* [  pnpm ](#tab-panel-9340)
* [  yarn ](#tab-panel-9341)

Terminal window

```

npx wrangler r2 bucket lock list [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket lock list [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket lock list [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to list lock rules for
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket lock set`

Set the lock configuration for an R2 bucket from a JSON file

* [  npm ](#tab-panel-9342)
* [  pnpm ](#tab-panel-9343)
* [  yarn ](#tab-panel-9344)

Terminal window

```

npx wrangler r2 bucket lock set [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket lock set [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket lock set [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to set lock configuration for
* `--file` ` string ` required  
Path to the JSON file containing lock configuration
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--force` ` boolean ` alias: --y default: false  
Skip confirmation

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket notification create`

Create an event notification rule for an R2 bucket

* [  npm ](#tab-panel-9345)
* [  pnpm ](#tab-panel-9346)
* [  yarn ](#tab-panel-9347)

Terminal window

```

npx wrangler r2 bucket notification create [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket notification create [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket notification create [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to create an event notification rule for
* `--event-types` ` "object-create" | "object-delete" ` alias: --event-type required  
The type of event(s) that will emit event notifications
* `--prefix` ` string `  
The prefix that an object must match to emit event notifications (note: regular expressions not supported)
* `--suffix` ` string `  
The suffix that an object must match to emit event notifications (note: regular expressions not supported)
* `--queue` ` string ` required  
The name of the queue that will receive event notification messages
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--description` ` string `  
A description that can be used to identify the event notification rule after creation

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket notification delete`

Delete an event notification rule from an R2 bucket

* [  npm ](#tab-panel-9348)
* [  pnpm ](#tab-panel-9349)
* [  yarn ](#tab-panel-9350)

Terminal window

```

npx wrangler r2 bucket notification delete [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket notification delete [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket notification delete [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to delete an event notification rule for
* `--queue` ` string ` required  
The name of the queue that corresponds to the event notification rule. If no rule is provided, all event notification rules associated with the bucket and queue will be deleted
* `--rule` ` string `  
The ID of the event notification rule to delete
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket notification list`

List event notification rules for an R2 bucket

* [  npm ](#tab-panel-9351)
* [  pnpm ](#tab-panel-9352)
* [  yarn ](#tab-panel-9353)

Terminal window

```

npx wrangler r2 bucket notification list [BUCKET]


```

Terminal window

```

pnpm wrangler r2 bucket notification list [BUCKET]


```

Terminal window

```

yarn wrangler r2 bucket notification list [BUCKET]


```

* `[BUCKET]` ` string ` required  
The name of the R2 bucket to get event notification rules for
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket sippy enable`

Enable Sippy on an R2 bucket

* [  npm ](#tab-panel-9354)
* [  pnpm ](#tab-panel-9355)
* [  yarn ](#tab-panel-9356)

Terminal window

```

npx wrangler r2 bucket sippy enable [NAME]


```

Terminal window

```

pnpm wrangler r2 bucket sippy enable [NAME]


```

Terminal window

```

yarn wrangler r2 bucket sippy enable [NAME]


```

* `[NAME]` ` string ` required  
The name of the bucket
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists
* `--provider` ` "AWS" | "GCS" `
* `--bucket` ` string `  
The name of the upstream bucket
* `--region` ` string `  
(AWS provider only) The region of the upstream bucket
* `--access-key-id` ` string `  
(AWS provider only) The secret access key id for the upstream bucket
* `--secret-access-key` ` string `  
(AWS provider only) The secret access key for the upstream bucket
* `--service-account-key-file` ` string `  
(GCS provider only) The path to your Google Cloud service account key JSON file
* `--client-email` ` string `  
(GCS provider only) The client email for your Google Cloud service account key
* `--private-key` ` string `  
(GCS provider only) The private key for your Google Cloud service account key
* `--r2-access-key-id` ` string `  
The secret access key id for this R2 bucket
* `--r2-secret-access-key` ` string `  
The secret access key for this R2 bucket

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket sippy disable`

Disable Sippy on an R2 bucket

* [  npm ](#tab-panel-9357)
* [  pnpm ](#tab-panel-9358)
* [  yarn ](#tab-panel-9359)

Terminal window

```

npx wrangler r2 bucket sippy disable [NAME]


```

Terminal window

```

pnpm wrangler r2 bucket sippy disable [NAME]


```

Terminal window

```

yarn wrangler r2 bucket sippy disable [NAME]


```

* `[NAME]` ` string ` required  
The name of the bucket
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 bucket sippy get`

Check the status of Sippy on an R2 bucket

* [  npm ](#tab-panel-9360)
* [  pnpm ](#tab-panel-9361)
* [  yarn ](#tab-panel-9362)

Terminal window

```

npx wrangler r2 bucket sippy get [NAME]


```

Terminal window

```

pnpm wrangler r2 bucket sippy get [NAME]


```

Terminal window

```

yarn wrangler r2 bucket sippy get [NAME]


```

* `[NAME]` ` string ` required  
The name of the bucket
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the bucket exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

## `r2 object`

Interact with R2 objects.

Note

The `r2 object` commands allow you to manage application data in the Cloudflare network to be accessed from Workers using [the R2 API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/).

### `r2 object get`

Fetch an object from an R2 bucket

* [  npm ](#tab-panel-9363)
* [  pnpm ](#tab-panel-9364)
* [  yarn ](#tab-panel-9365)

Terminal window

```

npx wrangler r2 object get [OBJECTPATH]


```

Terminal window

```

pnpm wrangler r2 object get [OBJECTPATH]


```

Terminal window

```

yarn wrangler r2 object get [OBJECTPATH]


```

* `[OBJECTPATH]` ` string ` required  
The source object path in the form of {bucket}/{key}
* `--file` ` string ` alias: --f  
The destination file to create
* `--pipe` ` boolean ` alias: --p  
Enables the file to be piped to a destination, rather than specified with the --file option
* `--local` ` boolean `  
Interact with local storage
* `--remote` ` boolean `  
Interact with remote storage
* `--persist-to` ` string `  
Directory for local persistence
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the object exists

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 object put`

Create an object in an R2 bucket

* [  npm ](#tab-panel-9366)
* [  pnpm ](#tab-panel-9367)
* [  yarn ](#tab-panel-9368)

Terminal window

```

npx wrangler r2 object put [OBJECTPATH]


```

Terminal window

```

pnpm wrangler r2 object put [OBJECTPATH]


```

Terminal window

```

yarn wrangler r2 object put [OBJECTPATH]


```

* `[OBJECTPATH]` ` string ` required  
The destination object path in the form of {bucket}/{key}
* `--content-type` ` string ` alias: --ct  
A standard MIME type describing the format of the object data
* `--content-disposition` ` string ` alias: --cd  
Specifies presentational information for the object
* `--content-encoding` ` string ` alias: --ce  
Specifies what content encodings have been applied to the object and thus what decoding mechanisms must be applied to obtain the media-type referenced by the Content-Type header field
* `--content-language` ` string ` alias: --cl  
The language the content is in
* `--cache-control` ` string ` alias: --cc  
Specifies caching behavior along the request/reply chain
* `--expires` ` string `  
The date and time at which the object is no longer cacheable
* `--local` ` boolean `  
Interact with local storage
* `--remote` ` boolean `  
Interact with remote storage
* `--persist-to` ` string `  
Directory for local persistence
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the object will be created
* `--storage-class` ` string ` alias: --s  
The storage class of the object to be created
* `--force` ` boolean ` alias: --y default: false  
Skip data catalog validation prompt
* `--file` ` string ` alias: --f  
The path of the file to upload
* `--pipe` ` boolean ` alias: --p  
Enables the file to be piped in, rather than specified with the --file option

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

### `r2 object delete`

Delete an object in an R2 bucket

* [  npm ](#tab-panel-9369)
* [  pnpm ](#tab-panel-9370)
* [  yarn ](#tab-panel-9371)

Terminal window

```

npx wrangler r2 object delete [OBJECTPATH]


```

Terminal window

```

pnpm wrangler r2 object delete [OBJECTPATH]


```

Terminal window

```

yarn wrangler r2 object delete [OBJECTPATH]


```

* `[OBJECTPATH]` ` string ` required  
The destination object path in the form of {bucket}/{key}
* `--local` ` boolean `  
Interact with local storage
* `--remote` ` boolean `  
Interact with remote storage
* `--persist-to` ` string `  
Directory for local persistence
* `--jurisdiction` ` string ` alias: --J  
The jurisdiction where the object exists
* `--force` ` boolean ` alias: --y default: false  
Skip data catalog validation prompt

Global flags

* `--v` ` boolean ` alias: --version  
Show version number
* `--cwd` ` string `  
Run as if Wrangler was started in the specified directory instead of the current working directory
* `--config` ` string ` alias: --c  
Path to Wrangler configuration file
* `--env` ` string ` alias: --e  
Environment to use for operations, and for selecting .env and .dev.vars files
* `--env-file` ` string `  
Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files
* `--experimental-provision` ` boolean ` aliases: --x-provision default: true  
Experimental: Enable automatic resource provisioning
* `--experimental-auto-create` ` boolean ` alias: --x-auto-create default: true  
Automatically provision draft bindings with new resources
* `--install-skills` ` boolean ` default: false  
Install Cloudflare agents skills, if not already present, without asking the user for confirmation

```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":{"@id":"/directory/","name":"Directory"}},{"@type":"ListItem","position":2,"item":{"@id":"/r2/","name":"R2"}},{"@type":"ListItem","position":3,"item":{"@id":"/r2/reference/","name":"Reference"}},{"@type":"ListItem","position":4,"item":{"@id":"/r2/reference/wrangler-commands/","name":"Wrangler commands"}}]}
```
