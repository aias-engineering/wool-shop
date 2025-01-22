# wool-shop

A small wool-shop not intended to order stuff, but to browse products done by a small NGO in a foreign country.

The NGO sells wool products to supporters in order to raise money. They currently use a PDF file to provide an overview
over their products and asked, if it would be possible to host a small website.

My engineering heart of course blew up this "could you do a small website" to: we're going to create a webshop.

## Requirements

The main requirement of course is presenting their products. They would like to be able to:

- show a picture or multiple pictures of their products
- provide some descriptive information about them

Secondary, it should be possible to order the desired products.
But not directly via the website, as they lack the logistics to ship products. The solution to this would be
a Wishlist mechanism.
Customers are able to create a wishlist and deliver that to the NGO.

As their main customers will be either people from the netherlands or the US, there
should be multilingual support for:

- Netherlands with products in €
- USA with products in $

## Architecture

This was a long journey, but I ended up with the following setup.

### Next.js

Next.js provided me the with the perfect toolset for server side and client side development.
It took me a moment to get into it, but I never looked back since then.

### Jotai

After exploring Redux and Zustand for the Client side state management and feeling overwhelmed on the
complicate setup it needed, I ended up with Jotai. It had a learning curve - I overused it heavily in the
begining, but in the end it provided enough functionality without needing me to create a plethora of files.

### Vercel (build and hosting)

I started out setting up the build environment with github actions and the hosting on Azure.
When I switched the hosting the build seemingly just came with it. The platform provides easily the easisiest
most straightforward experience I ever saw on these products.

### Azure Cosmos DB

Initially the whole project should have gotten deployed to Azure. The only thing left there is the dabase.
The Cosmos DB provides a solid non sql dabase.

### ImageKit.io as CDN

After the performance lecture I decided to move the whole image hosting to ImageKit.io.
They provide the possibility to scale and crop images via their API. I didn't gain much out of
it as Next.js already provides some scaling functionality, but moving still gave me valuable experience.

## Learnings

### What would I do differently?

I guess I wouldn't start this project alone again.
This gives you way too much freedom and I ended up reinventing the wheel several times.

- I moved from a Azure Web App to a Azure Container to a Vercel Web App hosting.
- I moved from 'Next.js' to 'Vite with React and Redux' back to 'Next.js with Zustand' and ended up with Next.js and Jotai
- I started out using BEM as my CSS strategy, then learned how to use it the correct way. After applying that, I moved forwared to Tailwind.

### What I learned?

I learned a lot - mainly how fast this world evolves in the frontend.
I started out thinking, I need to provide a way to host infrastructure, build my app and have it deployed.
In the end, this was all a little futile - Vercel provided me with everything.
The same with images - Next.js just does it for your.
This whole frontend world moves on in a really cool direction.
