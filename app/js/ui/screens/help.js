/**
 * Viz Magic — Help / Game Guide Screen
 */
var HelpScreen = (function() {
    'use strict';

    function render() {
        var t = Helpers.t;
        var el = Helpers.$('screen-help');
        if (!el) return;

        var sections = [
            { key: 'mana',        icon: '✨' },
            { key: 'hunt',        icon: '⚔️' },
            { key: 'armageddon',  icon: '⚠️' },
            { key: 'crafting',    icon: '🔨' },
            { key: 'marketplace', icon: '🏪' },
            { key: 'classes',     icon: '🧙' },
            { key: 'shares',      icon: '💎' },
            { key: 'blockchain',  icon: '⛓️' }
        ];

        var html = '<div class="help-screen">' +
            '<h1>' + t('help_title') + '</h1>' +
            '<p class="help-intro">' + t('help_intro') + '</p>';

        for (var i = 0; i < sections.length; i++) {
            var s = sections[i];
            html += '<section class="help-section" aria-label="' + t('help_section_' + s.key) + '">' +
                '<h2>' + s.icon + ' ' + t('help_section_' + s.key) + '</h2>' +
                '<p>' + t('help_' + s.key + '_text') + '</p>' +
                '</section>';
        }

        html += '</div>';
        el.innerHTML = html;
    }

    return { render: render };
})();
