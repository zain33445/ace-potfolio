import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  extends: vikeReact,
  prerender: true,
  headHtmlEnd: '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"ACE SERVICES","description":"Precision construction estimation and rapid quantity surveying platform.","url":"https://ace2-six.vercel.app","foundingDate":"2025","areaServed":"US","numberOfEmployees":{"@type":"QuantitativeValue","minValue":1,"maxValue":10},"address":{"@type":"PostalAddress","addressLocality":"Dallas","addressRegion":"TX","addressCountry":"US"},"hasOfferCatalog":{"@type":"OfferCatalog","name":"Pre-Construction Services","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":"Cost Estimating"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Material Takeoffs"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Permit Sets"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Project Scheduling"}}]}}</script>',
} satisfies Config
