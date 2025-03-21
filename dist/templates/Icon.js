import { jsx as _jsx } from "react/jsx-runtime";
const Icon = ({ className, size = 24, id }) => {
    return (_jsx("svg", { width: size, height: size, className: className, children: _jsx("use", { href: `/images/icons/sprite.svg#${id}` }) }));
};
export default Icon;
