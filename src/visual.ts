/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    "use strict";

  // powerbi.extensibility.utils.formatting
  import ValueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
  import TextProperties = powerbi.extensibility.utils.formatting.TextProperties;
  import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;
  import textMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;



    
    export interface Task{
      id: number | string;
      name: string;
      actualStart: String;      
      actualEnd: String;
      parent: string;
      children: string[]; 
      progressValue: string;     
  }

    export interface GroupedTask {
      id: number;
      name: string;
      tasks: Task[];
  }
  
    export interface GanttViewModel {
      dataView: DataView;
      tasks: Task[];
      isDurationFilled: boolean;
  }

    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;
        private host: IVisualHost;
        
        constructor(options: VisualConstructorOptions) {
            this.host=options.host;
            this.target = options.element;
            this.updateCount = 0;
            if (typeof document !== "undefined") {
                // const new_p: HTMLElement = document.createElement("p");
                // new_p.appendChild(document.createTextNode("Update count:"));
                // const new_em: HTMLElement = document.createElement("em");
                // this.textNode = document.createTextNode(this.updateCount.toString());
                // new_em.appendChild(this.textNode);
                // new_p.appendChild(new_em);
                // this.target.appendChild(new_p);
            }
        }

          private isValidDate(date: Date): boolean {
            if (Object.prototype.toString.call(date) !== "[object Date]") {
                return false;
            }

            return !isNaN(date.getTime());
        }
        

        private createTasks(
          dataView: DataView,
          host: IVisualHost): Task[] {
          let tasks: Task[] = [];
          const values: GanttColumns<any> = GanttColumns.getCategoricalValues(dataView);
          const groupValues: GanttColumns<DataViewValueColumn>[] = GanttColumns.getGroupedValueColumns(dataView);
          if (!values.Task) {
              return tasks;
          }
          let ParentTree={};

          console.log(values);

          values.Task.forEach((categoryValue: PrimitiveValue, index: number) => {
            
            const selectionBuider: ISelectionIdBuilder = host
                .createSelectionIdBuilder()
                .withCategory(dataView.categorical.categories[0], index);

            const selectionId: powerbi.extensibility.ISelectionId = selectionBuider.createSelectionId();
            let parent: string = (values.Parent && values.Parent[index] as string) || null;
            let startDate= (values.actualStart && values.actualStart[index])
                || new Date(Date.now());
            let EndDate= (values.actualEnd && values.actualEnd[index])
              || new Date(Date.now());


            //HACKY FIX THIS PLACE NEED TO BE CHANGED IN FUTURE, DATES MUST HAVE TO BE VALIDATED BEFORE PRINTING
            startDate=new Date(startDate.split('/')[2],startDate.split('/')[0]-1,startDate.split('/')[1]);
            EndDate= new Date(EndDate.split('/')[2],EndDate.split('/')[1],EndDate.split('/')[0]-1);

            
            startDate=Date.UTC(startDate.getFullYear(),startDate.getMonth(),startDate.getDay(),startDate.getHours(),startDate.getMinutes(),startDate.getSeconds());
            EndDate=Date.UTC(EndDate.getFullYear(),EndDate.getMonth(),EndDate.getDay(),EndDate.getHours(),EndDate.getMinutes(),EndDate.getSeconds());
            const progressvalue =values.progressValue[index] + '%';
                      
                       
            
            const task: Task = {
              id: categoryValue as string,
              name: categoryValue as string,
              actualStart: startDate,
              actualEnd: EndDate,
              progressValue:progressvalue,
              parent:parent,
              children: []
            };
          
          //if parent is present in the format pane group it
           if (values.Parent) {
              if(ParentTree[parent] === undefined){     		
                ParentTree[parent]={
                        "name":parent,
                         "children":[]
                 };
                 ParentTree[parent].children.push(task);
              }else{
                ParentTree[parent].children.push(task);
              }
           }else{
             tasks.push(task);  //else push the task directly
           }
           
           

        });
        
        //parent grouping must be pushed in array for anygantt to render
        if (values.Parent) {
          _.forEach(ParentTree, function(value, key) {
            tasks.push(value);
          });
        }

          return tasks;
        };


        public update(options: VisualUpdateOptions) {
          //   console.log(options);
            let dataViewCategories = options.dataViews[0].categorical.categories;
            let dataViewMeasures = options.dataViews[0].categorical.values;
            let dataInfo=options.dataViews[0].metadata.columns;
            let categories = [];
            let measureData=[];
            let parentGroup=[];
            let childGroup=[];
           
            dataInfo.forEach(info => {
              if(info.roles.Parent){
                parentGroup.push(info.displayName);
              }else{
                childGroup.push(info.displayName);
              }
            });
            dataViewCategories.forEach(category => {
              categories.push(category.values);
            });

            dataViewMeasures.forEach(measure => {
              measureData.push(measure.values);
            });

            
                const tasks: Task[] = this.createTasks(options.dataViews[0],this.host);
                console.log(tasks);
                 // data tree settings              
                 let treeData = anychart.data.tree(tasks, "as-tree");
                 let chart = anychart.ganttProject();      // chart type
                 chart.data(treeData);                   // chart data
                 chart.container(this.target).draw();      // set container and initiate drawing
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}