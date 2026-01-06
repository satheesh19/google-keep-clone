import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { FolderActionsT } from 'src/app/interfaces/folders';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class NavComponent implements OnInit {
  @ViewChild("modalContainer ") modalContainer !: ElementRef<HTMLInputElement>
  @ViewChild("modal") modal !: ElementRef<HTMLInputElement>
  @ViewChild("labelInput") labelInput !: ElementRef<HTMLInputElement>
  @ViewChild("labelError") labelError !: ElementRef<HTMLInputElement>

  constructor(public Shared: SharedService, public router: Router) { }

  // ? modal ----------------------------------------------------------
  openModal() {
    this.modalContainer.nativeElement.style.display = 'block';
    document.addEventListener('mousedown', this.mouseDownEvent)
  }
  hideModal() {
    this.modalContainer.nativeElement.style.display = 'none'
    document.removeEventListener('mousedown', this.mouseDownEvent)
  }
  mouseDownEvent = (event: Event) => {
    let modalEl = this.modal.nativeElement
    if (!(modalEl as any).contains(event.target)) {
      this.hideModal()
    }
  }

  // ? folders ----------------------------------------------------

  addFolder(el: HTMLInputElement) {
    if (!el) return
    try {
      console.log('NavComponent.addFolder', el.value)
      this.Shared.folder.db.add({ name: el.value })
        .then(() => { this.labelError.nativeElement.hidden = true; el.value = ''; el.focus() })
        .catch(x => { console.error('addFolder error', x); if (x && x.name === "ConstraintError") this.labelError.nativeElement.hidden = false; el.focus() })
    } catch (err) {
      console.error('addFolder unexpected error', err)
      el.focus()
    }
  }

  editFolder(id: number) {
    this.Shared.folder.id = id
    let actions: FolderActionsT = {
      delete: () => {
        this.Shared.folder.db.delete()
        this.Shared.folder.db.updateAllFolders('')
      },
      update: (value: string) => {
        this.Shared.folder.db.update({ name: value })
        this.Shared.folder.db.updateAllFolders(value)
      }
    }
    return actions
  }


  collapseSideBar() {
    document.querySelector('[sideBar]')?.classList.toggle('close')
  }


  ngOnInit(): void {
    this.Shared.closeSideBar.subscribe(x => { if (x) this.collapseSideBar() })
    if (window.innerWidth <= 600) {
      this.collapseSideBar()
    }
  }


}
