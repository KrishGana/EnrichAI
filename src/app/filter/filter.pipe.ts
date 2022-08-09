import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(ProjectList: any[], typetext: string): any[] {
    if(!ProjectList) return [];

    if(!typetext) return ProjectList;

    if( localStorage.getItem('FilterName') == 'false')
        return this.searchItems(ProjectList, typetext.toLowerCase());
    else{
       return this.searchItemsCats(ProjectList, typetext.toLowerCase());
      }
   }

   private searchItems(items :any[], searchText): any[] {
     let results = [];
      items.forEach(it => {
        if (it.ProjectName.toLowerCase().includes(searchText)) {
            results.push(it);
        // } else {
        //   let searchResults =  this.searchItems(it.ProjectName, searchText);
        //   if (searchResults.length > 0) {
        //       results.push({
        //         title: it.title,
        //         items_containers: searchResults
        //       });
        //   }
        }
      });
      return results;
   }

   private searchItemsCats(items :any[], searchText): any[] {
      let results = [];
      items.forEach(it => {
        if (it.Name.toLowerCase().includes(searchText) || it.Description.toLowerCase().includes(searchText)
        || it.Item.toLowerCase().includes(searchText) || it.Model.toLowerCase().includes(searchText) || it.Commodity.toLowerCase().includes(searchText)
       || it.FullText.toLowerCase().includes(searchText)) {

               results.push(it);
        }
      });
      return results;
   }
}