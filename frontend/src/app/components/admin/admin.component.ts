import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, Role } from '../../models';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';
  successMessage = '';

  // Modal state
  showAddModal = false;
  showEditModal = false;
  selectedUser: User | null = null;
  modalLoading = false;
  modalError = '';
  deletingId: number | null = null;

  addForm!: FormGroup;
  editForm!: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.loadUsers();
  }

  buildForms(): void {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required],
    });

    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required],
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.users = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load users';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.addForm.reset({ role: 'USER' });
    this.modalError = '';
    this.showAddModal = true;
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.editForm.patchValue({ name: user.name, email: user.email, role: user.role });
    this.modalError = '';
    this.showEditModal = true;
  }

  submitAdd(): void {
    if (this.addForm.invalid || this.modalLoading) return;
    this.modalLoading = true;
    this.modalError = '';

    this.userService.createUser(this.addForm.value).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.users.unshift(res.data);
          this.showAddModal = false;
          this.showSuccess('User created successfully');
        }
        this.modalLoading = false;
      },
      error: (err) => {
        this.modalError = err.error?.error || 'Failed to create user';
        this.modalLoading = false;
      }
    });
  }

  submitEdit(): void {
    if (this.editForm.invalid || this.modalLoading || !this.selectedUser) return;
    this.modalLoading = true;
    this.modalError = '';

    this.userService.updateUser(this.selectedUser.id, this.editForm.value).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const idx = this.users.findIndex(u => u.id === this.selectedUser!.id);
          if (idx !== -1) this.users[idx] = { ...this.users[idx], ...res.data };
          this.showEditModal = false;
          this.showSuccess('User updated successfully');
        }
        this.modalLoading = false;
      },
      error: (err) => {
        this.modalError = err.error?.error || 'Failed to update user';
        this.modalLoading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.deletingId = id;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.showSuccess('User deleted successfully');
        this.deletingId = null;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to delete user';
        this.deletingId = null;
      }
    });
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedUser = null;
    this.modalError = '';
    this.modalLoading = false;
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3000);
  }

  getRoleBadge(role: Role): string {
    return role === 'ADMIN'
      ? 'status-badge bg-amber-500/10 text-amber-400 border border-amber-500/20'
      : 'status-badge bg-slate-700/50 text-slate-400 border border-slate-600/30';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
