<?php
if( !function_exists('inforwindowTemplate') ){
    /**
     * inforwindow
     *
     * @param void
     * @return void
     * @since 1.0
     * @package JBPLUGIN
     * @category void
     * @author JACK BUI
     */
   function inforwindowTemplate(){
        $template = '<div class="infowindow" ><div class="post-item"><div class="place-wrapper">
            <a href="{{= permalink }}" class="img-place">
                <img src="{{= the_post_thumnail }}">
            </a>
            <div class="place-detail-wrapper">
                <h2 class="title-place"><a href="{{= permalink }}">{{= post_title }}</a></h2>
                <span class="address-place"><i class="fa fa-map-marker"></i> {{= et_full_location }}</span>
                <div class="rate-it" data-score="{{= rating_score }}"></div>
            </div>
        </div></div></div>';
        echo '<script type="text/template" id="jb_info_content_template">' . apply_filters('jb_add_map_template', $template) . '</script>';
        echo '<div class="map-element" style="display:none"></div>';
    }
}
/**
 * jb_map_shortcode
 *
 * @param void
 * @return void
 * @since 1.0
 * @package JBPLUGIN
 * @category void
 * @author JACK BUI
 */
function jb_map_shortcode(){ ?>
    <div id="map-wrapper">sssssssssssssssssssssssssssssss</div>
   
<?php }