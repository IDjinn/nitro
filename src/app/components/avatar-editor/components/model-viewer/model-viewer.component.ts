import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AdvancedMap } from '../../../../../client/core/utils/AdvancedMap';
import { CategoryData } from '../../common/CategoryData';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';
import { AvatarEditorService } from '../../services/avatar-editor.service';

@Component({
    selector: '[nitro-avatar-model-viewer-component]',
    templateUrl: './model-viewer.template.html'
})
export class AvatarEditorModelViewerComponent implements OnChanges
{
    @Input()
    public model: IAvatarEditorCategoryModel = null;

    @Input()
    public gender: string = null;

    private _activeCategory: CategoryData;

    constructor(private _avatarEditorService: AvatarEditorService)
    { }

    public ngOnChanges(changes: SimpleChanges): void
    {
        this.prepareModel();
    }

    public prepareModel(): void
    {
        if(!this.model) return;

        this.model.setViewer(this);

        this.model.init();

        this._activeCategory = null;

        this.selectFirstCategory();
    }

    private selectFirstCategory(): void
    {
        if(!this.model) return;

        for(const name of this.model.categories.getKeys())
        {
            if(!name) continue;

            this.selectCategory(name);

            return;
        }
    }

    public selectCategory(name: string): void
    {
        if(!this.model || !name) return;

        const category = this.model.categories.getValue(name);

        if(!category) return;

        category.init();

        this._activeCategory = category;

        for(const part of this._activeCategory.parts)
        {
            if(!part || !part.isSelected) continue;

            this.model.maxPaletteCount = part.colorLayerCount;

            break;
        }
    }

    public selectGender(gender: string): void
    {
        if(!this.model || !gender) return;

        (this._avatarEditorService.component && (this._avatarEditorService.component.gender = gender));
    }

    public get categories(): AdvancedMap<string, CategoryData>
    {
        return this.model.categories;
    }

    public get activeCategory(): CategoryData
    {
        return this._activeCategory;
    }

    public get canSetGender(): boolean
    {
        return (this.model && this.model.canSetGender);
    }

    public get maxPaletteCount(): number
    {
        return ((this.model && this.model.maxPaletteCount) || 1);
    }
}
