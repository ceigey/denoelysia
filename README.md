# Elysia on Deno Deploy (Example)

## Quick DIY

This is quite trivial to set up, the main takeaway:

**Do not use `.listen(...)`, export the WinterTC standard `app` instead.**

```ts
import { Elysia, file } from 'elysia'

const app = new Elysia().get('/', 'Hello Elysia')

export default app
```

That _should_ be all you need to do that's "off the beaten course".

But below are more comprehensive details & steps and alternatives.


## Prereqs

- Deno CLI tool, version >= 2.5
- A (new) Deno Deploy account already set up

## BYO

- Deno deploy account
- Formatter config (I prefer no semis and single quotes, but I'm just using the default here)
- Databse?

## Get started with the existing project

```sh
deno install
deno run dev
# At this point you will be asked for a bunch of permissions
# But if you don't care about permissions (YOLO mode):
deno run dev-all
# ^ you can probably configure things better than this :)
```

## Deploying it

You can do this in the web console too. I recommend
pushing your code to Github and deploying a Deno
app using a repo instead of the approach below,
especially if you are sharing the code publically
and you don't want people to see your user + project ID
directly.

```sh
deno deploy
# You'll then be made to authenticate
# If the wrong browser opens up, you can copy
# the URL it gives you and past it in the right browser
```

From here on things get interactive:

- Authenticate yourself to continue
- It might ask you to select the right organisation
- "Create a new application" (Unless you want to overwrite one!)
- It'll want to sign you in to Github

(Again if the wrong browser opens up, just copy the URL
and take your browsing business somewhere else)

- Then it's gonna take you to the Deno Deploy frontend online
- Configure your slug (URL)
- Configure your region
- Hit deploy and come back to the terminal to see the output!


Now at this point you might look around the web console
and look at the different project settings, and you'll see
"Link to Github", which you might want to explore.

Otherwise you'll find this in your `deno.json`:

```json
{
  "deploy": {
    "org": "<YOUR_USERNAME>",
    "app": "<YOUR_APP_SLUG>"
  }
}
```


## DIY Tutorial

Set up the Deno project (I'm using Deno 2.5, FYI):

```sh
mkdir denoelysia
cd denoelysia
deno init
code . # Now we're editing with VS Code
```

If you are in VS Code, you probably want to open the command palette
with cmd/ctrl-shift-p and run
_"Deno: Initialize Workspace Configuration"_,
assuming you have the extension.

Now add Elysia as a dependency:

```sh
deno add npm:elysia
```

Remember the `npm:`, but don't worry, by using `deno add` this way,
we get a free alias made for us:

```json
{
  "tasks": {
    "dev": "deno run --watch main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1",
    "elysia": "npm:elysia@^1.4.13"
  }
}
```

Now we need to add some code. Make an `app.ts` directly in the project
root (or anywhere, I'm just lazy):

```ts
import { Elysia, file } from 'elysia'

const app = new Elysia()
  .get('/', 'Hello Elysia')
  .get('/hello/:someone', ({ params: { someone } }) => `Hello, ${someone}!`)
  .get('/blob', file("blob.txt"))
  .get('/user/:id', ({ params: { id } }) => id)
  .post('/form', ({ body }) => body)

export default app
```

**Note: do not use `.listen(...)`,**
**export the WinterTC standard `app` instead.**

And make a text blob called `blob.txt` to demonstrate file loading works:

```
help i'm trapped in javascript
```

(Otherwise the `file` function will fail)

And now you can edit the `dev` task in your `deno.json` to say this instead:

```sh
deno serve --watch app.ts
```

And you can get rid of `main.ts` and `main_test.ts` at this point.

## Using Nitro instead

_Alternatively: See the Elysia docs for
[how to integrate with Nuxt](https://elysiajs.com/integrations/nuxt.html),
which bypasses this section a bit_.

In case you need server-side Vite for some reason,
or you want to add Elysia to a Nuxt app:

Nitro v3 (currently in alpha, as of writing) has some docs already up,
and these show examples of using
[Elysia with Nitro on the homepage](https://v3.nitro.build/),
and [deploying Nitro to Deno Deploy](https://v3.nitro.build/deploy/providers/deno-deploy).

_However_, this should **already be possible with Nitro v2/Nuxt v3+**.

In fact you can always hedge your bets, set up a Nuxt app,
add Elysia to the backend, then do something like set up
Elysia's [Eden Treaty](https://elysiajs.com/eden/treaty/overview)
and now you have a full-stack app with a typesafe client-server
API.

This of course assumes you like Vue :)

(React should be easier to deploy with Nitro)

## What about Deno Fresh?

Deno Fresh has a new H3/Hono like API, so you could always use that
for a full-stack app instead. But I've found Fresh's vite plugin
doesn't seem to play well with Elysia, so I would avoid mixing
those two together.

I'd recommend blending Elysia with Astro instead:

[Elysia Astro integration docs](https://elysiajs.com/integrations/astro.html#integration-with-astro)

You'll get similar capabilities to Deno Fresh (interactive islands etc),
and currently the Astro ecosystem is much more mature.
