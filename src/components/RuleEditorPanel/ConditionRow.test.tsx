import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ConditionRow } from "./ConditionRow";

describe("ConditionRow", () => {
  const defaultProps = {
    conditionKey: "plan",
    conditionValue: "pro",
    onKeyChange: vi.fn(),
    onValueChange: vi.fn(),
    onRemove: vi.fn(),
  };

  it("renders key and value inputs with current values", () => {
    render(<ConditionRow {...defaultProps} />);

    const keyInput = screen.getByPlaceholderText("key");
    const valueInput = screen.getByPlaceholderText("value");

    expect(keyInput).toHaveValue("plan");
    expect(valueInput).toHaveValue("pro");
  });

  it("renders the = separator between inputs", () => {
    render(<ConditionRow {...defaultProps} />);
    expect(screen.getByText("=")).toBeInTheDocument();
  });

  it("renders a remove button", () => {
    render(<ConditionRow {...defaultProps} />);
    expect(screen.getByRole("button", { name: "x" })).toBeInTheDocument();
  });

  it("calls onKeyChange when key input changes", async () => {
    const onKeyChange = vi.fn();
    render(<ConditionRow {...defaultProps} onKeyChange={onKeyChange} />);

    const keyInput = screen.getByPlaceholderText("key");
    await userEvent.clear(keyInput);
    await userEvent.type(keyInput, "region");

    expect(onKeyChange).toHaveBeenCalled();
  });

  it("calls onValueChange when value input changes", async () => {
    const onValueChange = vi.fn();
    render(<ConditionRow {...defaultProps} onValueChange={onValueChange} />);

    const valueInput = screen.getByPlaceholderText("value");
    await userEvent.clear(valueInput);
    await userEvent.type(valueInput, "us-east");

    expect(onValueChange).toHaveBeenCalled();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const onRemove = vi.fn();
    render(<ConditionRow {...defaultProps} onRemove={onRemove} />);

    const removeButton = screen.getByRole("button", { name: "x" });
    await userEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("shows validation error for empty key after blur", async () => {
    render(
      <ConditionRow {...defaultProps} conditionKey="" />
    );

    const keyInput = screen.getByPlaceholderText("key");
    await userEvent.click(keyInput);
    await userEvent.tab(); // blur

    expect(screen.getByText("Condition key cannot be empty")).toBeInTheDocument();
  });

  it("shows validation error for whitespace-only key after blur", async () => {
    render(
      <ConditionRow {...defaultProps} conditionKey="   " />
    );

    const keyInput = screen.getByPlaceholderText("key");
    await userEvent.click(keyInput);
    await userEvent.tab(); // blur

    expect(screen.getByText("Condition key cannot be empty")).toBeInTheDocument();
  });

  it("shows validation error for empty value after blur", async () => {
    render(
      <ConditionRow {...defaultProps} conditionValue="" />
    );

    const valueInput = screen.getByPlaceholderText("value");
    await userEvent.click(valueInput);
    await userEvent.tab(); // blur

    expect(screen.getByText("Condition value cannot be empty")).toBeInTheDocument();
  });

  it("shows validation error for whitespace-only value after blur", async () => {
    render(
      <ConditionRow {...defaultProps} conditionValue="   " />
    );

    const valueInput = screen.getByPlaceholderText("value");
    await userEvent.click(valueInput);
    await userEvent.tab(); // blur

    expect(screen.getByText("Condition value cannot be empty")).toBeInTheDocument();
  });

  it("does not show validation errors before inputs are touched", () => {
    render(
      <ConditionRow {...defaultProps} conditionKey="" conditionValue="" />
    );

    expect(screen.queryByText("Condition key cannot be empty")).not.toBeInTheDocument();
    expect(screen.queryByText("Condition value cannot be empty")).not.toBeInTheDocument();
  });

  it("does not show validation errors when key and value are non-empty", async () => {
    render(<ConditionRow {...defaultProps} />);

    const keyInput = screen.getByPlaceholderText("key");
    const valueInput = screen.getByPlaceholderText("value");

    // Touch both inputs
    await userEvent.click(keyInput);
    await userEvent.tab();
    await userEvent.click(valueInput);
    await userEvent.tab();

    expect(screen.queryByText("Condition key cannot be empty")).not.toBeInTheDocument();
    expect(screen.queryByText("Condition value cannot be empty")).not.toBeInTheDocument();
  });
});
