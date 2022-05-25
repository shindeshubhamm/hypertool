import ButtonNode from "./ButtonNode";
import CheckboxNode from "./CheckboxNode";
import ContainerNode from "./ContainerNode";
import FragmentNode from "./FragmentNode";
import SelectNode from "./SelectNode";
import TextFieldNode from "./TextFieldNode";
import TextNode from "./TextNode";
import ViewNode from "./ViewNode";

export const nodeMappings = {
    Button: ButtonNode,
    Container: ContainerNode,
    Text: TextNode,
    Select: SelectNode,
    Checkbox: CheckboxNode,
    View: ViewNode,
    Fragment: FragmentNode,
    TextField: TextFieldNode,
};

export {
    ButtonNode,
    CheckboxNode,
    ContainerNode,
    FragmentNode,
    SelectNode,
    TextNode,
    ViewNode,
    TextFieldNode,
};
