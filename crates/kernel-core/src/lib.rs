#![no_std]
#![forbid(unsafe_code)]

//! Platform-independent primitives shared by Phantom-X Browser and Native editions.
//!
//! This crate intentionally contains no hardware access, scheduler, allocator,
//! browser bindings, or boot code.

#[cfg(test)]
extern crate std;

pub mod abi;
pub mod capability;
pub mod error;
pub mod task;

pub use abi::{AbiVersion, KERNEL_ABI_VERSION, ProcessId, ServiceId, TaskId};
pub use capability::{Capability, CapabilitySet};
pub use error::KernelError;
pub use task::{TaskDescriptor, TaskState};
