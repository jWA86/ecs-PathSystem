import { IComponent } from "ecs-framework";
export { CompoundPathComponent };

class CompoundPathComponent implements IComponent {
    constructor(public entityId: number, public active: boolean,
        public visible: boolean,
        public firstPathId: number,
        public nbPath: number) {
    }
}
// to add : lenght
