require('bootstrap');
import { ComponentsUtils } from './ComponentsUtils'

const initApp = () => {
    ComponentsUtils.setupPopovers('[data-bs-toggle="popover"]');
    console.log('Application initialized');
}


initApp();
