import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { UserService } from './core/services/user/user.service';
import { dSeeder } from './shared/modules/tree-seeder/seeder';
import { deepOmit } from './shared/modules/deep-omit';
import dTree from 'd3-dtree';
// import {dSeeder} from './shared/modules/tree-seeder/seeder'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ancestry-architect';

  constructor(private usersService: UserService) {

  }

  ngOnInit() {
    // const treeData = [{
    //   "name": "Niclas Superlongsurname",
    //   "class": "man",
    //   "textClass": "emphasis",
    //   "extra": {
    //     date: '1990-2005',
    //   },
    //   "marriages": [{
    //     "spouse": {
    //       "name": "Iliana",
    //       "class": "woman",
    //       "extra": {
    //         "nickname": "Illi",
    //         date: '1990-2015',
    //       }
    //     },
    //     "children": [{
    //       "name": "James",
    //       "class": "man",
    //       "marriages": [{
    //         "spouse": {
    //           "name": "Alexandrafff  f df df dsf dsf dsf f ds ",
    //           "class": "woman"
    //         },
    //         "children": [{
    //           "name": "Eric",
    //           "class": "man",
    //           "marriages": [{
    //             "spouse": {
    //               "name": "Eva",
    //               "class": "woman",
    //               "extra": {
    //                 "nickname": "fffffff"
    //               }
    //             }
    //           }]
    //         }, {
    //           "name": "Jane",
    //           "class": "woman"
    //         }, {
    //           "name": "Jasper",
    //           "class": "man"
    //         }, {
    //           "name": "Emma",
    //           "class": "woman"
    //         }, {
    //           "name": "Julia",
    //           "class": "woman"
    //         }, {
    //           "name": "Jessica",
    //           "class": "woman"
    //         }]
    //       }]
    //     }]
    //   }]
    // }]

    const data = [{
      id: 0,
      name: 'Niclas Superlongsurname',
      parent1Id: null,
      parent2Id: null,
      gender: "man",
      date: '1990-2005',
    },
    {
      id: 1,
      name: 'Iliana',
      parent1Id: null,
      parent2Id: null,
      gender: "woman",
      nickname: "Illi",
      date: '1990-2015',
    },
    {
      id: 2,
      name: 'James',
      parent1Id: 0,
      parent2Id: 1,
      gender: "man",
    },
    {
      id: 3,
      name: 'Alexandra',
      parent1Id: null,
      parent2Id: null,
      gender: "woman",
    },
    {
      id: 4,
      name: 'Eric',
      parent1Id: 3,
      parent2Id: 2,
      gender: "man",
      date: '1990-2015',
    },
    {
      id: 5,
      name: 'Eva',
      parent1Id: null,
      parent2Id: null,
      gender: "woman",
    },
    {
      id: 6,
      name: 'Jane',
      parent1Id: 2,
      parent2Id: 3,
      gender: "woman",
    },
    {
      id: 7,
      name: 'Jasper',
      parent1Id: 2,
      parent2Id: 3,
      gender: "man",
    },
    {
      id: 8,
      name: 'Emma',
      parent1Id: 2,
      parent2Id: 3,
      gender: "woman",
    },
    {
      id: 12,
      name: 'Julia',
      parent1Id: 2,
      parent2Id: 3,
      gender: "woman",
    },
    {
      id: 9,
      name: 'Jessica',
      parent1Id: 2,
      parent2Id: 3,
      gender: "woman",
    },
    {
      id: 10,
      name: 'Jussic',
      parent1Id: null,
      parent2Id: null,
      gender: "man",
    },
    {
      id: 11,
      name: 'Jussic 2',
      parent1Id: 9,
      parent2Id: 10,
      gender: "woman",
    },
    {
      id: 13,
      name: 'Jussic another',
      parent1Id: null,
      parent2Id: null,
      gender: "man",
    },
    {
      id: 14,
      name: 'Jussic 3',
      parent1Id: 9,
      parent2Id: 13,
      gender: "woman",
    },
    ]; //dTree's

    const dSeederOptions = { //customized to display same tree as in dTree's JSFiddle
      class: (member: any) => member.gender,
      // textClass: (member: any) => {
      //   if (member.id === targetId) {
      //     return "emphasis";
      //   }
      // },
      extra: (member: any) => {
        return {
          nickname: member.nickname,
          date: member.date,
        };
      }
    };
    let treeData: Record<string, any> = dSeeder.seed(data, 0, dSeederOptions) as Record<string, any>;

    treeData = deepOmit(treeData, 'depthOffset')

    console.log(treeData);

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 100
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 60
    
    dTree.init(treeData, {
      target: "#tree",
      debug: true,
      height: vh,
      width: vw,
      nodeWidth: 150,
      callbacks: {
        nodeClick: function(name: any, extra: any) {
          console.log(name);
        },
        textRenderer: function(name: string, extra: { nickname: string; date: string }, textClass: string) {
          // THis callback is optinal but can be used to customize
          // how the text is rendered without having to rewrite the entire node
          // from screatch.
          const date = extra?.date || ''
          if (extra && extra.nickname)
            name = name + " (" + extra.nickname + ")";
          return `
          <div class="node">
            <img class="node__avatar" src="avatar.webp" alt="text height="50px" width="50px"> 
            <p align="center" class="${textClass}">${name}<div>${date}</div></p>
          </div>
          `;
        },
        nodeRenderer: function(name: any, x: any, y: any, height: any, width: any, extra: any, id: string, nodeClass: string, textClass: any, textRenderer: (arg0: any, arg1: any, arg2: any) => string) {
          // This callback is optional but can be used to customize the
          // node element using HTML.
          let node = '';
          node += '<div ';
          node += 'style="height:100px;width:100%;" ';
          node += 'class="' + textClass + '" ';
          node += 'id="node' + id + '">\n';
         
          node += textRenderer(name, extra, nodeClass);
          
          node += '</div>';
          return node;
      }
      }
    });
    
  }

  isGotUser(): boolean {
    return this.usersService.userIsFetched;
  }
}
