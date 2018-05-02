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
    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;
        
        

        constructor(options: VisualConstructorOptions) {
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
        
        private createRowData(dataView: DataView) {
          let rowDefs = [];
          let totalRows = dataView.categorical.categories[0].values.length;
          for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
            let rowDef = {};
            let selectionIdBuilder;
            dataView.categorical.categories.forEach(categoryColumn => {                
              rowDef[categoryColumn.source.displayName] =
                categoryColumn.values[rowIndex];
            });
            dataView.categorical.values.forEach(measureColumn => {
              rowDef[measureColumn.source.displayName] =
                measureColumn.values[rowIndex];
            });

            rowDefs.push(rowDef);
           
          }
          return rowDefs;
        }

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
           let parent=categories[1];
           let tasks=categories[0];
           let startDate=categories[2];
           let endDate=categories[3];
           let formattedData=this.createRowData(options.dataViews[0]);
           
          //  let GroupData = _.chain(formattedData)
          //  .groupBy(parentGroup[0])
          //  .pairs()
          //  .map(function (currentItem) {
          //      return _.object(_.zip(["color", "users"], currentItem));
          //  })
           

           
        
          //   let parentArray = categories[0].map( function(x, i){
          //       return {"name": x, "members": categories[1][i]}        
          //   }.bind(this));

          //   console.log(parentArray);
            
          //   let grouppedArray=_.groupBy(parentArray,'name')
          //   console.log(grouppedArray);
          //   console.log(dataViewMeasures);
          //   let seriesData = [];
            
            
          //   console.log(seriesData);

            // let rowLength = categories.length , columnLength = categories[0].length;
            // for (var columnIndex = 0; columnIndex < columnLength; columnIndex++) {
            //     for (var rowIndex = 0; rowIndex < rowLength; rowIndex++) {
            //         if(xAxisCategories[columnIndex]){
            //             xAxisCategories[columnIndex] = xAxisCategories[columnIndex] + "/" + categories[rowIndex][columnIndex];                        
            //         }else{
            //             xAxisCategories[columnIndex] = categories[rowIndex][columnIndex];
            //         }
            //     }                
            // }
            // let dataViewMeasures = options.dataViews[0].categorical.values;
            // 
            

            // console.log(seriesData);


                let rawData = [
                 {
                   "name": "Activities",
                   "actualStart": Date.UTC(2007, 0, 25),
                   "actualEnd": Date.UTC(2007, 2, 14),
                   "children": [
                     {
                       "name": "Draft plan",
                       "actualStart": Date.UTC(2007, 0, 25),
                       "actualEnd": Date.UTC(2007, 1, 3)
                     },
                     {
                       "name": "Board meeting",
                       "actualStart": Date.UTC(2007, 1, 4),
                       "actualEnd": Date.UTC(2007, 1, 4)
                     },
                     {
                       "name": "Research option",
                       "actualStart": Date.UTC(2007, 1, 4),
                       "actualEnd": Date.UTC(2007, 1, 24)
                     },
                     {
                       "name": "Final plan",
                       "actualStart": Date.UTC(2007, 1, 24),
                       "actualEnd": Date.UTC(2007, 2, 14)
                     }
                   ]
                 },
                 {
                    "name": "Activities 2",
                    "actualStart": Date.UTC(2007, 0, 25),
                    "actualEnd": Date.UTC(2007, 2, 14),
                    "children": [
                      {
                        "name": "Draft plan",
                        "actualStart": Date.UTC(2007, 0, 25),
                        "actualEnd": Date.UTC(2007, 1, 3)
                      },
                      {
                        "name": "Board meeting",
                        "actualStart": Date.UTC(2007, 1, 4),
                        "actualEnd": Date.UTC(2007, 1, 4)
                      },
                      {
                        "name": "Research option",
                        "actualStart": Date.UTC(2007, 1, 4),
                        "actualEnd": Date.UTC(2007, 1, 24)
                      },
                      {
                        "name": "Final plan",
                        "actualStart": Date.UTC(2007, 1, 24),
                        "actualEnd": Date.UTC(2007, 2, 14)
                      }
                    ]
                  }];

                 // data tree settings                
                 let treeData = anychart.data.tree(rawData, "as-tree");
                 let chart = anychart.ganttProject();      // chart type
                 chart.data(treeData);                   // chart data
                 chart.container(this.target).draw();      // set container and initiate drawing
           
            // this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            // console.log('Visual update', options);
            // if (typeof this.textNode !== "undefined") {
            //     this.textNode.textContent = (this.updateCount++).toString();
            // }
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