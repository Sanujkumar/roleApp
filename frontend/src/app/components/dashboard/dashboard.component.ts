import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AuthUser, Record, RecordStatus } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user: AuthUser | null = null;
  records: Record[] = [];
  loading = false;
  error = '';

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.error = '';

    this.userService.getRecords().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.records = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load records';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: RecordStatus): string {
    const classes: { [key in RecordStatus]: string } = {
      PENDING:   'status-badge bg-amber-500/10 text-amber-400 border border-amber-500/20',
      ACTIVE:    'status-badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      COMPLETED: 'status-badge bg-blue-500/10 text-blue-400 border border-blue-500/20',
      ARCHIVED:  'status-badge bg-slate-500/10 text-slate-400 border border-slate-500/20',
    };
    return classes[status] || classes['PENDING'];
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  get totalRecords(): number {
    return this.records.length;
  }

  get statusCounts(): { [key: string]: number } {
    return this.records.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }
}  