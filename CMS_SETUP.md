# SveltiaCMS Setup for Afuera del Cuadrito

## Overview

This project now includes SveltiaCMS, a modern Git-based headless CMS that serves as a successor to NetlifyCMS/DecapCMS. SveltiaCMS offers better performance, modern UI with dark mode support, mobile compatibility, and many improvements over legacy CMS solutions.

## Setup Complete

✅ Admin interface created at `/public/admin/`
✅ Configuration file configured for your content structure
✅ Collections set up for Posts, Authors, and Pages

## Next Steps

### 1. Configure Your Git Backend

Edit `/public/admin/config.yml` and update the backend configuration:

```yaml
backend:
  name: github # or gitlab, gitea
  repo: your-username/afuera-del-cuadrito # Replace with your actual repository
  branch: main # or master
```

### 2. Set up Authentication

You have several options:

**Option A: GitHub/GitLab OAuth (Recommended)**

1. Create an OAuth application in your Git provider
2. Use Netlify's identity service or deploy your own OAuth handler
3. Update the site URLs in the config

**Option B: Personal Access Token (Quick Setup)**

1. Generate a personal access token from your Git provider
2. Use it to sign in directly to the CMS

**Option C: Local Development**

1. For local development, you can use the test backend:

```yaml
backend:
  name: test
```

### 3. Access the CMS

Once configured, access your CMS at:

- Local development: `http://localhost:4321/admin/`
- Production: `https://your-site.com/admin/`

## Features Configured

### Collections

1. **Blog Posts** (`/src/content/posts/`)
   - Title, meta title, description
   - Publish date, featured image
   - Categories, authors (with relations), tags
   - Draft status and full markdown content

2. **Authors** (`/src/content/authors/`)
   - Name, profile image, bio
   - Social media links
   - About content

3. **Pages** (`/src/content/pages/`)
   - Standard pages like contact, privacy policy
   - Full markdown content with meta fields

4. **Special Pages**
   - About page (singleton)

### Media Management

- Upload directory: `/public/images/uploads/`
- Automatic image optimization (SveltiaCMS feature)
- Support for drag & drop uploads
- Built-in stock photo integration (Pexels, Pixabay, Unsplash)

## SveltiaCMS Advantages

- 🚀 **Performance**: Much faster than NetlifyCMS/DecapCMS
- 🎨 **Modern UI**: Dark mode, mobile support, better UX
- 🔧 **Features**: Image optimization, stock photos, translation services
- 🛡️ **Security**: Better security practices and updated dependencies
- 📱 **Mobile**: Full mobile and tablet support
- 🌍 **i18n**: First-class internationalization support

## Configuration Options

The CMS supports many advanced features. Check out the SveltiaCMS documentation for:

- Advanced field types and widgets
- Custom preview templates
- Workflow configurations
- Integration with external services

## Support

- SveltiaCMS Documentation: https://github.com/sveltia/sveltia-cms
- Community Discord: Available through the GitHub repository
- Migration from NetlifyCMS/DecapCMS: SveltiaCMS is designed as a drop-in replacement

## Local Development

To test the CMS locally:

1. Start your Astro development server: `npm run dev`
2. Navigate to `http://localhost:4321/admin/`
3. Use the test backend for local development

## Production Deployment

Before deploying:

1. Update all URL references in `config.yml`
2. Set up proper authentication
3. Test the admin interface
4. Configure any custom OAuth if needed

The CMS files are served statically from your Astro build, so no additional server setup is required.
