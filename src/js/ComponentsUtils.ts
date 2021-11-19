import { Popover } from 'bootstrap';

export class ComponentsUtils {

    /**
     * Initializes the all bootstrap popovers on the page.
     * @param selector of the popover objects
     * @returns array of bootsrap Popover objects
     */
    static setupPopovers(selector: string): Popover[] {
        const popoverOwnerElements = [].slice.call(document.querySelectorAll(selector))
        return popoverOwnerElements.map(function (popoverElem: HTMLElement) {
            const contentSelector = popoverElem.getAttribute('data-content-selector')
            const popoverContentElems = contentSelector ? document.querySelectorAll(contentSelector) : null;
            
            if (popoverContentElems && popoverContentElems.length > 0) {
                const content = popoverContentElems.item(0);
                content.remove(); // remove the content from dom
                return new Popover(popoverElem, {
                    html: true,
                    content: content,
                    template: '<div class="popover popover-with-html" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
                })
            } else {
                return new Popover(popoverElem)
            }
        })
    }
}