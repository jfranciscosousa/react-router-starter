export interface LocationInfo {
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  source: "cloudflare" | "vercel" | "cloudfront" | "ipapi" | "accept-language";
}

export interface DeviceInfo {
  browser?: string;
  os?: string;
  device?: "mobile" | "tablet" | "desktop";
  isBot: boolean;
}

export interface RequestInfo {
  ipAddress: string;
  userAgent: string;
  location?: string | null;
  device?: string | null;
}

export interface RequestInfoOptions {
  includeLocation?: boolean;
  includeDevice?: boolean;
  geoProvider?: "headers" | "ipapi" | "both";
  fallbackToLanguage?: boolean;
}

/**
 * Extract client IP address from request headers
 */
function getClientIP(request: Request): string {
  // Check common headers in order of preference
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;

  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP) return cfConnectingIP;

  return request.headers.get("x-client-ip") || "unknown";
}

/**
 * Get location from CDN/edge platform headers
 */
function getLocationFromHeaders(request: Request): LocationInfo | null {
  // Cloudflare headers
  const cfCountry = request.headers.get("cf-ipcountry");
  const cfCity = request.headers.get("cf-ipcity");
  const cfRegion = request.headers.get("cf-region");

  if (cfCountry) {
    return {
      country: cfCountry,
      city: cfCity ? decodeURIComponent(cfCity) : undefined,
      region: cfRegion || undefined,
      source: "cloudflare",
    };
  }

  // Vercel headers
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  const vercelRegion = request.headers.get("x-vercel-ip-country-region");
  const vercelCity = request.headers.get("x-vercel-ip-city");

  if (vercelCountry) {
    return {
      country: vercelCountry,
      city: vercelCity ? decodeURIComponent(vercelCity) : undefined,
      region: vercelRegion || undefined,
      source: "vercel",
    };
  }

  // AWS CloudFront headers
  const awsCountry = request.headers.get("cloudfront-viewer-country");
  if (awsCountry) {
    return {
      country: awsCountry,
      source: "cloudfront",
    };
  }

  return null;
}

/**
 * Get location from IP using external service
 */
async function getLocationFromIP(ip: string): Promise<LocationInfo | null> {
  if (
    ip === "unknown" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip === "127.0.0.1"
  ) {
    return null;
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "request-info-extractor/1.0" },
    });

    if (!response.ok) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json();

    if (data.error) return null;

    return {
      country: data.country_code,
      city: data.city,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude,
      source: "ipapi",
    };
  } catch (error) {
    console.warn("IP geolocation lookup failed:", error);
    return null;
  }
}

/**
 * Parse user agent for device information
 */
function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();

  // Bot detection (simple)
  const isBot =
    /bot|crawler|spider|scraper|curl|wget|python|java|go-http|okhttp/i.test(
      userAgent,
    );

  // Device detection
  let device: "mobile" | "tablet" | "desktop" = "desktop";
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    device = "mobile";
  } else if (/tablet|ipad|kindle|silk/i.test(ua)) {
    device = "tablet";
  }

  // Browser detection
  let browser: string | undefined;
  if (ua.includes("chrome") && !ua.includes("edge")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera")) browser = "Opera";

  // OS detection
  let os: string | undefined;
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
    os = "iOS";

  return { browser, os, device, isBot };
}

/**
 * Extract comprehensive information from a Request object
 */
export async function getRequestInfo(request: Request): Promise<RequestInfo> {
  const ipAddress = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  let location: LocationInfo | null = null;

  // Try headers
  location = getLocationFromHeaders(request);

  // Try IP lookup if no location from headers
  if (!location) {
    location = await getLocationFromIP(ipAddress);
  }

  let device: DeviceInfo | null = null;
  if (userAgent !== "unknown") {
    device = parseUserAgent(userAgent);
  }

  return {
    ipAddress,
    userAgent,
    location: location
      ? `${capitalizeFirstLetter(location?.city) || "Unknown city"}, ${location?.region || "Unknown region"}, ${location?.country || "Unknown country"}`
      : undefined,
    device: device
      ? `${capitalizeFirstLetter(device.device) || "Unknown device"}, ${device.browser || "Unknown browser"}`
      : undefined,
  };
}

function capitalizeFirstLetter(word?: string) {
  if (!word) return word;

  return String(word).charAt(0).toUpperCase() + String(word).slice(1);
}
