//! Platform-neutral task descriptors and lifecycle states.

use crate::abi::{ProcessId, TaskId};

/// Lifecycle state reported by a platform task manager.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum TaskState {
    New,
    Ready,
    Running,
    Blocked,
    Exited,
}

/// Descriptive task metadata shared with management interfaces.
///
/// This type does not create, schedule, or execute a task.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct TaskDescriptor {
    pub id: TaskId,
    pub process_id: ProcessId,
    pub state: TaskState,
    /// Relative priority hint; lower values represent higher priority.
    pub priority: u8,
}

impl TaskDescriptor {
    /// Create a task descriptor.
    pub const fn new(
        id: TaskId,
        process_id: ProcessId,
        state: TaskState,
        priority: u8,
    ) -> Self {
        Self {
            id,
            process_id,
            state,
            priority,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{TaskDescriptor, TaskState};
    use std::assert_eq;

    #[test]
    fn descriptor_preserves_task_metadata() {
        let task = TaskDescriptor::new(7, 3, TaskState::Ready, 10);
        assert_eq!(task.id, 7);
        assert_eq!(task.process_id, 3);
        assert_eq!(task.state, TaskState::Ready);
        assert_eq!(task.priority, 10);
    }
}
