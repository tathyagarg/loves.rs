<div align="center">

  ![Banner](.github/assets/banner.png)

  # loves.rs

  ### Free Rust-themed subdomains with full DNS control

![GitHub stars](https://img.shields.io/github/stars/tathyagarg/loves.rs)
![GitHub license](https://img.shields.io/github/license/tathyagarg/loves.rs)
![GitHub issues](https://img.shields.io/github/issues/tathyagarg/loves.rs)
![Website](https://img.shields.io/website?url=https%3A%2F%2Floves.rs)

  [Homepage](https://www.loves.rs)

</div>

![Homepage](.github/assets/ss1.png)

## Example

Claim: `harbor.loves.rs`

And point it anywhere:
```
A      harbor.loves.rs      -> 203.0.113.10
AAAA   harbor.loves.rs      -> 2001:db8::1
CNAME  harbor.loves.rs      -> harbor.vercel.app
TXT    harbor.loves.rs      -> "hello world"
```

## Features

- GitHub OAuth authentication
- Instant subdomain provisioning
- Up to 3 subdomains per account
- Full DNS control
- A, AAAA, CNAME, TXT, NS, and PTR support
- Custom TTL selection
- Nested subdomains

## FAQ

### 

### Why only 3 subdomains?

To prevent abuse and ensure fair usage.

### Can I create nested subdomains?

Yes. If you own `example.loves.rs`, you can create records such as `blog.example.loves.rs`.

### What records are supported?

A, AAAA, CNAME, TXT, NS and PTR.

### Does using loves.rs support Russia?

No. `.rs` is the country code top-level domain (ccTLD) for Serbia, not Russia. Russia's ccTLD is `.ru`.

loves.rs has no affiliation with Russia, Russian organizations, or the Russian government. The domain was chosen because `.rs` is also the file extension for Rust source files.

## Star History

<a href="https://www.star-history.com/?repos=tathyagarg%2Floves.rs&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=tathyagarg/loves.rs&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=tathyagarg/loves.rs&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=tathyagarg/loves.rs&type=date&legend=top-left" />
 </picture>
</a>
