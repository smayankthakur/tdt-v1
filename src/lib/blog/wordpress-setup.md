# WordPress Setup Guide for Divine Tarot Blog
# Step-by-step instructions to set up your SEO-optimized blog

## STEP 1: Domain & Hosting Setup

### Option A: Subdomain (Recommended)
1. Go to your domain provider (GoDaddy, Namecheap, etc.)
2. Create DNS record:
   - Type: CNAME
   - Name: blog
   - Value: your-vercel-deployment.vercel.app
3. Wait 24-48 hours for propagation

### Option B: Separate Domain
1. Purchase: blog.thedivinetarot.com
2. Point A record to hosting IP

## STEP 2: WordPress Installation

### Using Installatron (if on cPanel hosting)
1. Login to cPanel
2. Go to "Installatron" > "Applications"
3. Search "WordPress"
4. Install with settings:
   - Domain: blog.thedivinetarot.com
   - Directory: (leave empty)
   - Admin email: your@email.com

### Using Cloudflare Workers (Serverless)
1. Create Worker at workers.dev
2. Configure WordPress in subdirectory

## STEP 3: Required Plugins

### SEO (Required)
```bash
# Install via WordPress Admin
Plugin Name: Rank Math SEO
Purpose: Meta tags, schema, keyword optimization
Settings:
  - Focus keyword in title: Yes
  - SEO score: 90+
  - Schema: Article, FAQ
```

### Performance (Required)
```bash
Plugin Name: WP Rocket
Purpose: Caching, minification, speed
Settings:
  - Page caching: Enabled
  - Minify CSS/JS: Enabled
  - Lazy load images: Enabled
  - Database optimization: Weekly
```

### Optional UI
```bash
Plugin Name: Elementor Pro
Purpose: Custom blog design
Settings:
  - Theme builder for single posts
  - Custom archive layout
```

### REST API (Required for Automation)
1. Go to Settings > Permalinks
2. Select "Post name"
3. No additional config needed - REST API enabled by default

## STEP 4: Theme Setup

### Free Theme (Astra)
1. Appearance > Themes > Add New
2. Search "Astra"
3. Install & Activate
4. Import "Free Blog Starter" template

### Settings:
- Layout: Full width container
- Blog archive: Grid layout (2-3 columns)
- Single post: Sidebar with related posts

## STEP 5: SEO Configuration (Rank Math)

### Global Settings
1. Rank Math > General Settings
2. Title Separator: " | "
3. Home Page Title: Divine Tarot - Your Spiritual Guide
4. Homepage Description: Get free tarot readings, daily horoscopes, and spiritual guidance at Divine Tarot.

### Article Settings
1. Rank Math > Titles & Meta > Posts
2. Default SEO Title: %%title%% | Divine Tarot
3. Default Meta Description: %%excerpt%%

### Schema Settings
1. Articles: Article
2. FAQ: Q&A
3. Organization: Spiritual Service

## STEP 6: Categories Setup

Create categories in Posts > Categories:

| Category | ID | Description |
|----------|-----|-------------|
| Love & Relationships | 1 | Ex back, soulmate, dating |
| Career & Finance | 2 | Job changes, business, money |
| Daily Horoscope | 3 | Daily zodiac readings |
| Tarot Guides | 4 | How-to, meanings, spreads |
| Spiritual Growth | 5 | Meditation, intuition |

## STEP 7: REST API Credentials

### Generate App Password
1. Users > Profile
2. Scroll to "Application Passwords"
3. Name: "Divine Tarot Content API"
4. Copy the generated password

### Test API Access
```bash
curl -u "username:app-password" \
  https://blog.thedivinetarot.com/wp-json/wp/v2/posts
```

## STEP 8: Internal Linking Setup

### Install "Internal Links Manager"
1. Plugins > Add New
2. Search "Internal Links Manager"
3. Configure:
   - Auto-link keywords
   - Max links per post: 3
   - Priority: Titles first

### Link Structure
- Every post links to 2-3 related posts
- Every post links to /reading page
- Category pages link to main articles

## STEP 9: Performance Optimization

### Image Optimization
1. Install "Smush" plugin
2. Auto-compress: Enabled
3. Lazy load: Enabled

### Caching (WP Rocket)
```
Page Cache: Enabled
Cache Timeout: 10 hours
Minify CSS: Enabled
Minify JS: Enabled
Defer JS: Enabled
```

## STEP 10: Analytics Setup

### Google Analytics
1. Install "MonsterInsights" plugin
2. Connect Google Analytics account
3. Enable:
   - Scroll tracking
   - Outbound link tracking
   - Form submission tracking

### Search Console
1. Go to Google Search Console
2. Add property: blog.thedivinetarot.com
3. Submit sitemap: /sitemap.xml
4. Use Rank Math to connect

## STEP 11: Automation API Endpoints

### Your Content Script Will Use:
```
POST /wp-json/wp/v2/posts
GET /wp-json/wp/v2/posts
PUT /wp-json/wp/v2/posts/{id}
DELETE /wp-json/wp/v2/posts/{id}
GET /wp-json/wp/v2/categories
GET /wp-json/wp/v2/tags
```

## STEP 12: Environment Variables

Add to your project .env.local:
```
WORDPRESS_API_URL=https://blog.thedivinetarot.com/wp-json/wp/v2
WORDPRESS_USERNAME=your-admin-username
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

## TROUBLESHOOTING

### Issue: REST API Returns 401
Solution: Check Application Password is correct

### Issue: Images Not Loading
Solution: Update "Site Address" in Settings > General

### Issue: Slow Loading
Solution: Enable WP Rocket caching

### Issue: SEO Not Working
Solution: Verify Rank Math is connected to Search Console