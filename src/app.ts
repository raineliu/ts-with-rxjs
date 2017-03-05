import { Observable } from "rxjs"
import { createTodoItem } from './lib'

const $input = <HTMLInputElement>document.querySelector('.todo-val')
const $list = <HTMLUListElement>document.querySelector('.list-group')
const $add = document.querySelector('.button-add')
//fromEvent将一个eventListener转变成一个Observable
//filter过滤，只留下enter键响应
//map,filter过滤掉空值
const enter$ = Observable.fromEvent<KeyboardEvent>($input, 'keydown')
  .filter(r => r.keyCode === 13)

const clickAdd$ = Observable.fromEvent<MouseEvent>($add, 'click')
//将add按钮事件变成Observable,然后合并到enter Observable
const input$ = enter$.merge(clickAdd$)

const item$ = input$
  .map(() => {
    console.log('input value=', $input.value)
    return $input.value
  })
  .filter(r => r !== '')
  .map(createTodoItem)
  .do((el: HTMLLIElement) => {
    $list.appendChild(el)
    $input.value = '';//清空输入框的值
  })
  // .publishReplay(1)
  // .refCount()
  .do(e => { console.log('e:', e) })
//map and merge
// const toggle$ = item$.mergeMap($todoItem => {
//   return Observable.fromEvent<MouseEvent>($todoItem, 'click')
//     .filter(e => e.target === $todoItem)
//     .mapTo($todoItem)
// })
// .do(($todoItem: HTMLElement) => {
//   if ($todoItem.classList.contains('done')) {
//     $todoItem.classList.remove('done')
//   } else {
//     $todoItem.classList.add('done')
// }
// })

const remove$ = item$.mergeMap($todoItem => {
  const $removeButton = $todoItem.querySelector('.button-remove')
  return Observable.fromEvent($removeButton, 'click')
    .mapTo($todoItem)
})
  .do(($todoItem: HTMLElement) => {
    const $parent = $todoItem.parentNode
    $parent.removeChild($todoItem)
  })

const app$ = remove$
  .do(r => console.log(r))
//懒加载，最后一步必须订阅
app$.subscribe()







// import { Observable, Observer, Subject } from 'rxjs'
// import {createTodoItem,mockToggle,mockHttpPost,search,HttpResponse} from './lib'
// import { FileUploader } from './FileUploader'

// const $input = <HTMLInputElement>document.querySelector('.todo-val')
// const $list = <HTMLUListElement>document.querySelector('.list-group')
// const $add = document.querySelector('.button-add')

// const type$ = Observable.fromEvent<KeyboardEvent>($input, 'keydown')
//   .publish()
//   .refCount()

// const enter$ = type$
//   .filter(r => r.keyCode === 13)

// const clickAdd$ = Observable.fromEvent<MouseEvent>($add, 'click')

// const input$ = enter$.merge(clickAdd$)

// const clearInputSubject$ = new Subject<void>()

// const item$ = input$
//   .map(() => $input.value)
//   .filter(r => r !== '')
//   .distinct(null, clearInputSubject$)
//   .switchMap(mockHttpPost)
//   .map(createTodoItem)
//   .do((ele: HTMLLIElement) => {
//     $list.appendChild(ele)
//     $input.value = ''
//     clearInputSubject$.next()
//   })
//   .publishReplay(1)
//   .refCount()

// const toggle$ = item$.mergeMap($todoItem => {
//   return Observable.fromEvent<MouseEvent>($todoItem, 'click')
//     .debounceTime(300)
//     .filter(e => e.target === $todoItem)
//     .mapTo({
//       data: {
//         _id: $todoItem.dataset['id'],
//         isDone: $todoItem.classList.contains('done')
//       }, $todoItem
//     })
//   })
//   .switchMap(result => {
//     return mockToggle(result.data._id, result.data.isDone)
//       .mapTo(result.$todoItem)
//   })
//   .do(($todoItem: HTMLElement) => {
//     if ($todoItem.classList.contains('done')) {
//       $todoItem.classList.remove('done')
//     } else {
//       $todoItem.classList.add('done')
//     }
//   })

// const remove$ = item$.mergeMap($todoItem => {
//   const $removeButton = $todoItem.querySelector('.button-remove')
//   return Observable.fromEvent($removeButton, 'click')
//     .mapTo($todoItem)
// })
//   .do(($todoItem: HTMLElement) => {
//     // 从 DOM 上移掉 todo item
//     const $parent = $todoItem.parentNode
//     $parent.removeChild($todoItem)
//   })

// const search$ = type$.debounceTime(200)
//   .filter(evt => evt.keyCode !== 13)
//   .map(result => (<HTMLInputElement>result.target).value)
//   .switchMap(search)
//   .do((result: HttpResponse | null) => {
//     const actived = document.querySelectorAll('.active')
//     Array.prototype.forEach.call(actived, (item: HTMLElement) => {
//       item.classList.remove('active')
//     })
//     if (result) {
//       const item = document.querySelector(`.todo-item-${result._id}`)
//       item.classList.add('active')
//     }
//   })

// const uploader = new FileUploader()

// const app$ = toggle$.merge(remove$, search$, uploader.uploadStream$)
//   .do(r => {
//     console.log(r)
//   })

// app$.subscribe()
