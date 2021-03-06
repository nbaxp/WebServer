import { App } from 'vue';
declare class UIComponent {
  static install(vue: App): void;
}
declare class Avatar extends UIComponent {}
declare class Button extends UIComponent {}
declare class Cell extends UIComponent {}
declare class CellGroup extends UIComponent {}
declare class Icon extends UIComponent {}
declare class Price extends UIComponent {}
declare class OverLay extends UIComponent {}
declare class Divider extends UIComponent {}
declare class Layout extends UIComponent {}
declare class Col extends UIComponent {}
declare class Row extends UIComponent {}
declare class ImagePreview extends UIComponent {}
declare class Swipe extends UIComponent {}
declare class ActionSheet extends UIComponent {}
declare class BackTop extends UIComponent {}
declare class Collapse extends UIComponent {}
declare class CollapseItem extends UIComponent {}
declare class Drag extends UIComponent {}
declare class Dialog extends UIComponent {}
declare class InfiniteLoading extends UIComponent {}
declare class Notify extends UIComponent {}
declare class Range extends UIComponent {}
declare class Video extends UIComponent {}
declare class Popup extends UIComponent {}
declare class Steps extends UIComponent {}
declare class Step extends UIComponent {}
declare class Swiper extends UIComponent {}
declare class SwiperItem extends UIComponent {}
declare class Switch extends UIComponent {}
declare class Toast extends UIComponent {}
declare class Progress extends UIComponent {}
declare class CircleProgress extends UIComponent {}
declare class NoticeBar extends UIComponent {}
declare class SearchBar extends UIComponent {}
declare class Navbar extends UIComponent {}
declare class FixedNav extends UIComponent {}
declare class Tab extends UIComponent {}
declare class TabPanel extends UIComponent {}
declare class MenuItem extends UIComponent {}
declare class Tabbar extends UIComponent {}
declare class TabbarItem extends UIComponent {}
declare class Elevator extends UIComponent {}
declare class Pagination extends UIComponent {}
declare class Tabs extends UIComponent {}
declare class TabPane extends UIComponent {}
declare class Calendar extends UIComponent {}
declare class Checkbox extends UIComponent {}
declare class CheckboxGroup extends UIComponent {}
declare class DatePicker extends UIComponent {}
declare class InputNumber extends UIComponent {}
declare class Input extends UIComponent {}
declare class Radio extends UIComponent {}
declare class RadioGroup extends UIComponent {}
declare class Rate extends UIComponent {}
declare class Picker extends UIComponent {}
declare class ShortPassword extends UIComponent {}
declare class TextArea extends UIComponent {}
declare class Uploader extends UIComponent {}
declare class CountUp extends UIComponent {}
declare class NumberKeyboard extends UIComponent {}
declare class CountDown extends UIComponent {}
declare class Badge extends UIComponent {}
declare class Tag extends UIComponent {}
declare class Popover extends UIComponent {}
declare class Address extends UIComponent {}
declare class Barrage extends UIComponent {}
declare class Signature extends UIComponent {}
declare class TimeSelect extends UIComponent {}
declare class TimePannel extends UIComponent {}
declare class TimeDetail extends UIComponent {}

export interface InstallationOptions {
  locale?: any;
  lang?: any;
}
declare function install(app: App, options?: InstallationOptions): void;
export { Avatar,Button,Cell,CellGroup,Icon,Price,OverLay,Divider,Layout,Col,Row,ImagePreview,Swipe,ActionSheet,BackTop,Collapse,CollapseItem,Drag,Dialog,InfiniteLoading,Notify,Range,Video,Popup,Steps,Step,Swiper,SwiperItem,Switch,Toast,Progress,CircleProgress,NoticeBar,SearchBar,Navbar,FixedNav,Tab,TabPanel,MenuItem,Tabbar,TabbarItem,Elevator,Pagination,Tabs,TabPane,Calendar,Checkbox,CheckboxGroup,DatePicker,InputNumber,Input,Radio,RadioGroup,Rate,Picker,ShortPassword,TextArea,Uploader,CountUp,NumberKeyboard,CountDown,Badge,Tag,Popover,Address,Barrage,Signature,TimeSelect,TimePannel,TimeDetail,install };
declare const _default: {
  install: typeof install;
  version: string;
};
export default _default;