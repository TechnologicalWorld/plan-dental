<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tratamiento', function (Blueprint $table) {
            $table->id('idTratamiento');
            $table->string('nombre', 100);
            $table->decimal('precio', 10,2)->nullable();
 
            $table->unsignedBigInteger('idCita')->nullable();
            $table->foreign('idCita')->references('idCita')->on('cita')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tratamiento');
    }
};
