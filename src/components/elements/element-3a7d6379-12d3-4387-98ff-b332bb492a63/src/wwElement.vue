<template>
    <component
        :is="linkTag"
        v-bind="properties"
        class="ww-image-basic ww-hover-scale"
        ww-responsive="ww-image-basic"
        :style="style"
        :class="{ '-link': hasLink && !isEditing }"
    >
        <div class="ww-image-basic-overlay"></div>
        <picture v-if="supportsWebP">
            <source 
                :srcset="webpSrcset" 
                :sizes="responsiveSizes"
                type="image/webp"
            />
            <source 
                :srcset="responsiveSrcset || src" 
                :sizes="responsiveSizes"
                :type="imageType"
            />
            <img 
                :src="src" 
                :alt="alt" 
                v-bind="{ loading: content.loading || 'lazy' }"
                :class="imageClasses"
                @load="onImageLoad"
                @error="onImageError"
            />
        </picture>
        <img 
            v-else
            :src="src" 
            :alt="alt" 
            v-bind="{ loading: content.loading || 'lazy' }"
            :srcset="responsiveSrcset"
            :sizes="responsiveSizes"
            :class="imageClasses"
            @load="onImageLoad"
            @error="onImageError"
        />
    </component>
</template>

<script>
export default {
    inject: {
        componentStyle: { default: () => {} },
    },
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['update:content', 'image-load', 'image-error'],
    data() {
        return {
            imageLoaded: false,
            imageError: false,
            supportsWebP: false,
        };
    },
    mounted() {
        this.checkWebPSupport();
    },
    setup() {
        const { hasLink, tag: linkTag, properties } = wwLib.wwElement.useLink();

        return {
            hasLink,
            linkTag,
            properties,
        };
    },
    computed: {
        /* URL */
        url() {
            const url = this.wwElementState.props.url || this.content.url || '';
            return typeof url === 'string' ? url : '';
        },
        isWeWeb() {
            return this.url.startsWith('designs/');
        },
        src() {
            return this.isWeWeb ? `${wwLib.wwUtils.getCdnPrefix()}${this.url}` : this.url;
        },

        /* STYLE */
        aspectRatio() {
            const elementAspectRatio = this.componentStyle.aspectRatio;
            if (elementAspectRatio && elementAspectRatio !== 'unset') {
                return `${elementAspectRatio}`;
            } else {
                return 'unset';
            }
        },
        style() {
            return {
                '--wwi-ar': this.aspectRatio,
                '--wwi-of': this.content.objectFit,
                '--wwi-f': this.content.filter,
                '--wwi-o': this.content.overlay,
            };
        },
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },

        /* ALT */
        alt() {
            return wwLib.wwLang.getText(this.content.alt);
        },

        /* RESPONSIVE IMAGES */
        responsiveSrcset() {
            if (!this.src || this.isWeWeb) return '';
            
            // Generate responsive srcset for external images
            if (this.src.includes('imagedelivery.net') || this.src.includes('unsplash.com')) {
                const baseUrl = this.src.split('?')[0];
                const hasParams = this.src.includes('?');
                const separator = hasParams ? '&' : '?';
                
                return [
                    `${baseUrl}${separator}w=400 400w`,
                    `${baseUrl}${separator}w=800 800w`,
                    `${baseUrl}${separator}w=1200 1200w`,
                    `${baseUrl}${separator}w=1600 1600w`
                ].join(', ');
            }
            
            return '';
        },

        responsiveSizes() {
            // Define responsive sizes based on common breakpoints
            return '(max-width: 480px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 70vw';
        },

        webpSrcset() {
            if (!this.src || !this.supportsWebP || this.isWeWeb) return '';
            
            // Generate WebP srcset for external images
            if (this.src.includes('imagedelivery.net')) {
                const baseUrl = this.src.split('?')[0];
                const hasParams = this.src.includes('?');
                const separator = hasParams ? '&' : '?';
                
                return [
                    `${baseUrl}${separator}w=400&format=webp 400w`,
                    `${baseUrl}${separator}w=800&format=webp 800w`,
                    `${baseUrl}${separator}w=1200&format=webp 1200w`,
                    `${baseUrl}${separator}w=1600&format=webp 1600w`
                ].join(', ');
            }
            
            return '';
        },

        imageType() {
            if (!this.src) return '';
            
            const extension = this.src.split('.').pop()?.toLowerCase();
            const mimeTypes = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'svg': 'image/svg+xml',
                'webp': 'image/webp'
            };
            
            return mimeTypes[extension] || 'image/jpeg';
        },

        imageClasses() {
            return {
                'img-loading': !this.imageLoaded && !this.imageError,
                'img-loaded': this.imageLoaded,
                'img-error': this.imageError,
                'img-high-dpi': true,
            };
        },
    },
    methods: {
        checkWebPSupport() {
            // Check if browser supports WebP
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.supportsWebP = (webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        },

        onImageLoad(event) {
            this.imageLoaded = true;
            this.imageError = false;
            this.$emit('image-load', event);
        },

        onImageError(event) {
            this.imageError = true;
            this.imageLoaded = false;
            this.$emit('image-error', event);
        },
    },
};
</script>

<style scoped lang="scss">
.ww-image-basic {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    
    /* Mobile-first responsive container */
    width: 100%;
    max-width: 100%;

    &.-link {
        cursor: pointer;
    }

    &-overlay {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--wwi-o);
        pointer-events: none;
    }

    & img {
        z-index: 0;
        width: 100%;
        height: auto; /* Changed from 100% for better responsiveness */
        display: block;
        aspect-ratio: var(--wwi-ar);
        object-fit: var(--wwi-of, cover); /* Default to cover for better mobile display */
        filter: var(--wwi-f);
        image-rendering: -webkit-optimize-contrast;
        
        /* Mobile optimizations */
        max-width: 100%;
        transition: transform 0.3s ease; /* Smooth transitions for hover effects */
        
        /* Ensure proper aspect ratio on mobile */
        @media (max-width: 768px) {
            object-fit: var(--wwi-of, contain); /* Better fit for mobile */
            max-height: 70vh; /* Prevent images from being too tall on mobile */
        }
        
        /* Small mobile devices */
        @media (max-width: 480px) {
            max-height: 60vh;
            border-radius: inherit; /* Inherit border radius from parent if set */
        }
    }
    
    /* Portrait orientation optimizations */
    @media (orientation: portrait) and (max-width: 768px) {
        & img {
            object-fit: var(--wwi-of, contain);
            max-height: 50vh;
        }
    }
    
    /* Landscape orientation optimizations */
    @media (orientation: landscape) and (max-height: 500px) {
        & img {
            max-height: 80vh;
            object-fit: var(--wwi-of, cover);
        }
    }
}

</style>
