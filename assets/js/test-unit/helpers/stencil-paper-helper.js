
/**
 * Most Content of this file was adapter from the @bigcommerce/stencil-cli https://github.com/bigcommerce/stencil-cli
 * theme assembler implementation
 * @return {string}
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const PaperHandlebar = require('@bigcommerce/stencil-paper');
// eslint-disable-next-line import/no-extraneous-dependencies
const TemplateAssembler = require('@bigcommerce/stencil-cli/lib/template-assembler');
// eslint-disable-next-line import/no-extraneous-dependencies
const LangAssembler = require('@bigcommerce/stencil-cli/lib/lang-assembler');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

/**
 * Get the actual template directory
 * @return {string}
 */
const getThemeTemplatesPath = () => path.join(process.cwd(), 'templates');


export default class StencilPaperHelper {
    /**
     * Add current page theme context,
     * this must be a parsable json
     * @param template
     * @param themeContext
     */
    constructor(template, themeContext) {
        this.contextObject = themeContext;
        this.template = template;

        /**
         * Init paper handlebar
         */
        this.paperHandler = new PaperHandlebar(this.contextObject.settings, this.contextObject.theme_settings, this);
    }


    async renderHTML() {
        /**
         * Get all files within the templates directory
         * @type {*|*[]}
         */
        const paths = this.loadAllFiles('templates');

        /**
         * Load theme files and helpers
         */
        // eslint-disable-next-line  no-unused-expressions
        await this.paperHandler.loadTheme(paths, 'en');

        /**
         * Attach context object to the files
         */
        const request = await this.paperHandler.renderTheme(this.template, {
            remote: true,
            remote_data: this.contextObject,
        });
        document.documentElement.innerHTML = request.content;
        return document.documentElement;
    }

    /**
     * Assemble all template file
     * Implementation copied from @bigcommerce
     * @param p
     * @param processor
     * @return {Promise<unknown>}
     */
    getTemplates(p, processor) {
        return new Promise((resolve, reject) => {
            TemplateAssembler.assemble(getThemeTemplatesPath(), p, (err, templates) => {
                if (err) {
                    return reject(err);
                }
                if (templates[p]) {
                    const match = templates[p].match(/---\r?\n[\S\s]*\r?\n---\r?\n([\S\s]*)$/);

                    if (_.isObject(match) && match[1]) {
                        // eslint-disable-next-line no-param-reassign
                        templates[path] = match[1];
                    }
                }
                return resolve(processor(templates));
            });
        });
    }

    /**
     * Get all the current language translation
     * implementation copied from @bigcommerce
     * @return {Promise<unknown>}
     */
    getTranslations() {
        return new Promise((resolve, reject) => {
            LangAssembler.assemble((err, translations) => {
                if (err) {
                    return reject(err);
                }
                return resolve(_.mapValues(translations, locales => JSON.parse(locales)));
            });
        });
    }

    /**
     * Scan and load the directory files recursively
     * removing the .html as the end of each files
     */
    loadAllFiles(dir, _files) {
        // eslint-disable-next-line no-param-reassign
        _files = _files || [];
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            let name = path.join(dir, file);
            if (fs.statSync(name).isDirectory()) {
                this.loadAllFiles(name, _files);
            } else if (name.indexOf('.html') > -1) {
                name = name.split('.')[0].split(path.sep);
                name.shift();
                name = name.join(path.sep);
                _files.push(name);
            }
        });
        return _files;
    }
}
