import { createRouter, createWebHistory } from 'vue-router';

import wwPage from './views/wwPage.vue';

import { initializeData, initializePlugins, onPageUnload } from '@/_common/helpers/data';

let router;
const routes = [];

function scrollBehavior(to) {
    if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        };
    } else {
        return { top: 0 };
    }
}

 
/* wwFront:start */
import pluginsSettings from '../../plugins-settings.json';

// eslint-disable-next-line no-undef
window.wwg_designInfo = {"id":"0ddf84a5-59f8-49b6-afc8-af7569862966","homePageId":"ebcfcca4-7515-419d-a604-ae8357452a24","authPluginId":null,"baseTag":null,"defaultTheme":"light","langs":[{"lang":"en","default":true}],"background":{},"workflows":[],"pages":[{"id":"ebcfcca4-7515-419d-a604-ae8357452a24","linkId":"ebcfcca4-7515-419d-a604-ae8357452a24","name":"Home","folder":null,"paths":{"en":"home","default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"b7987979-1c77-462e-b3c1-a05b26ecea37","sectionTitle":"Navbar Section","linkId":"c84a7969-7472-4bb5-bec3-d020df3f911c"},{"uid":"ac0b1e8c-2363-41b1-9daa-49d580bb8c6f","sectionTitle":"Hero Section","linkId":"b7ba3362-f254-4ccc-b645-c25f1bbfadb1"},{"uid":"6c6aee78-9a91-4f82-bc75-53821d8a6df8","sectionTitle":"Banner Section","linkId":"64ae0d68-f406-492c-a475-0d805cc5db96"},{"uid":"1b0b31e0-8a1d-4c98-9562-2a7bffd7b340","sectionTitle":"Problem Section","linkId":"22e8c12e-538d-4a73-afd6-773eb7628e23"},{"uid":"7e236026-ae26-43c1-b165-0a64b12a6d75","sectionTitle":"Solution Section","linkId":"6e045aa9-d08a-44e4-a9a7-8a610d46c14c"},{"uid":"65d42922-bfc5-4316-a142-4e29212b74d9","sectionTitle":"Section","linkId":"2f53283b-7e0e-4437-95d4-4f533c8c6b8c"},{"uid":"eeca3349-b596-4f42-8363-38d479ae30ba","sectionTitle":"Training Section","linkId":"4dbad45f-e681-443c-ba82-edd0fb05b28e"},{"uid":"2225af1a-6129-4282-9fbe-35e98a57ccee","sectionTitle":"Format Section","linkId":"eef1b36c-2ef6-4b02-85c6-cc8dedb6d3e9"},{"uid":"c7ba5dc1-c233-4dd9-bcdb-39a1d7642e7e","sectionTitle":"Community Section","linkId":"fb72ebfb-9c12-4ea2-bff6-c6f60d3b7eb7"},{"uid":"71aef82d-8d34-45b3-bdf7-1310e073766c","sectionTitle":"Pricing Section","linkId":"48f72cdc-a762-4443-9b79-a82b06c7b148"},{"uid":"1fb36b5f-587e-46f8-8fd2-f32ec4a7913c","sectionTitle":"Guarantees Section","linkId":"6e808e81-df3f-48a1-b9fd-73c81b4b37bb"},{"uid":"33abbee2-21ea-439c-afe7-322d23c08713","sectionTitle":"CTA Section","linkId":"4c23bf34-e481-491a-8048-a6addbf36959"},{"uid":"a823c108-9097-4a2a-a8cd-8505c1ef1cc9","sectionTitle":"About Section","linkId":"80ef4ab2-7c2e-4c87-8ddd-6499ae9d30a2"},{"uid":"92bc5b23-03e5-41c2-8ab4-69ead7d7d977","sectionTitle":"Footer Section","linkId":"c57f4ec1-f582-4ffd-b9e1-a4849c6648a9"}],"pageUserGroups":[],"title":{"en":"","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""}],"plugins":[{"id":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","name":"REST API","namespace":"restApi"}]};
// eslint-disable-next-line no-undef
window.wwg_cacheVersion = 1;
// eslint-disable-next-line no-undef
window.wwg_pluginsSettings = pluginsSettings;
// eslint-disable-next-line no-undef
window.wwg_disableManifest = false;

const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {};

const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    //Replace params
    path = path.replace(/{{([\w]+)\|([^/]+)?}}/g, ':$1');

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
            lang,
            isPrivate: !!page.pageUserGroups?.length,
        },
        async beforeEnter(to, from) {
            if (to.name === from.name) return;
            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            //Init plugins
            await initializePlugins();

            //Check if private page
            if (page.pageUserGroups?.length) {
                // cancel navigation if no plugin
                if (!wwLib.wwAuth.plugin) {
                    return false;
                }

                await wwLib.wwAuth.init();

                // Redirect to not sign in page if not logged
                if (!wwLib.wwAuth.getIsAuthenticated()) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthenticatedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }

                //Check roles are required
                if (
                    page.pageUserGroups.length > 1 &&
                    !wwLib.wwAuth.matchUserGroups(page.pageUserGroups.map(({ userGroup }) => userGroup))
                ) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthorizedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }
            }

            try {
                await import(`@/pages/${page.id.split('_')[0]}.js`);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return;
            } catch (err) {
                wwLib.$store.dispatch('front/showPageLoadProgress', false);

                if (err.redirectUrl) {
                    return { path: err.redirectUrl || '404' };
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
if (page404) {
    for (const lang of window.wwg_designInfo.langs) {
        // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
        if (!page404.langs.includes(lang.lang)) continue;
        registerRoute(
            page404,
            {
                default: false,
                lang: lang.lang,
            },
            '/:pathMatch(.*)*'
        );
    }
    // Create route /:pathMatch(.*)* using default project lang
    registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
} else {
    routes.push({
        path: '/:pathMatch(.*)*',
        async beforeEnter() {
            window.location.href = '/404';
        },
    });
}

let routerOptions = {};

const isProd =
    !window.location.host.includes(
        // TODO: add staging2 ?
        '-staging.' + (process.env.WW_ENV === 'staging' ? import.meta.env.VITE_APP_PREVIEW_URL : '')
    ) && !window.location.host.includes(import.meta.env.VITE_APP_PREVIEW_URL);

if (isProd && window.wwg_designInfo.baseTag?.href) {
    let baseTag = window.wwg_designInfo.baseTag.href;
    if (!baseTag.startsWith('/')) {
        baseTag = '/' + baseTag;
    }
    if (!baseTag.endsWith('/')) {
        baseTag += '/';
    }

    routerOptions = {
        base: baseTag,
        history: createWebHistory(baseTag),
        routes,
    };
} else {
    routerOptions = {
        history: createWebHistory(),
        routes,
    };
}

router = createRouter({
    ...routerOptions,
    scrollBehavior,
});

//Trigger on page unload
let isFirstNavigation = true;
router.beforeEach(async (to, from) => {
    if (to.name === from.name) return;
    if (!isFirstNavigation) await onPageUnload();
    isFirstNavigation = false;
    wwLib.globalVariables._navigationId++;
    return;
});

//Init page
router.afterEach((to, from, failure) => {
    wwLib.$store.dispatch('front/showPageLoadProgress', false);
    let fromPath = from.path;
    let toPath = to.path;
    if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
    if (!toPath.endsWith('/')) toPath = toPath + '/';
    if (failure || (from.name && toPath === fromPath)) return;
    initializeData(to);
});
/* wwFront:end */

export default router;
